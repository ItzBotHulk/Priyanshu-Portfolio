"use client";

import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Html, useProgress, useTexture, Billboard } from "@react-three/drei";
import * as THREE from "three";

// Dynamic 3D Orbiting Tech Icons Configuration for "Messy" 3D Cloud (Tighter range, no bobble)
const ORBIT_ICONS = [
  { name: "JavaScript", src: "/img/javascript.svg", invert: false, radius: 1.25, yOffset: -0.1, speed: 0.85, tiltX: 0.35, tiltZ: 0.25, phase: 0 },
  { name: "React", src: "/img/react.svg", invert: false, radius: 1.5, yOffset: 0.35, speed: -0.75, tiltX: -0.45, tiltZ: 0.5, phase: 0.95 },
  { name: "Next.js", src: "/img/nextjs.svg", invert: true, radius: 1.2, yOffset: -0.45, speed: 0.95, tiltX: 0.6, tiltZ: -0.35, phase: 1.85 },
  { name: "Node.js", src: "/img/nodejs.svg", invert: false, radius: 1.6, yOffset: 0.65, speed: -0.65, tiltX: -0.25, tiltZ: -0.45, phase: 2.75 },
  { name: "Express", src: "/img/express.svg", invert: true, radius: 1.35, yOffset: 0.1, speed: 1.05, tiltX: 0.5, tiltZ: 0.4, phase: 3.65 },
  { name: "Tailwind", src: "/img/tailwind.svg", invert: false, radius: 1.45, yOffset: -0.3, speed: -0.85, tiltX: -0.55, tiltZ: 0.35, phase: 4.55 },
  { name: "Python", src: "/img/python.svg", invert: false, radius: 1.3, yOffset: 0.45, speed: 0.75, tiltX: 0.3, tiltZ: -0.6, phase: 5.45 },
  { name: "Django", src: "/img/django.svg", isDjango: true, radius: 1.55, yOffset: -0.2, speed: -0.95, tiltX: -0.35, tiltZ: 0.35, phase: 0.45 },
  { name: "HTML5", src: "/img/html.svg", invert: false, radius: 1.2, yOffset: 0.75, speed: 0.8, tiltX: 0.45, tiltZ: -0.25, phase: 1.55 },
  { name: "CSS3", src: "/img/css.svg", invert: false, radius: 1.4, yOffset: -0.55, speed: -0.75, tiltX: -0.6, tiltZ: -0.35, phase: 2.45 },
  { name: "MongoDB", src: "/img/MongoDB.svg", invert: false, radius: 1.5, yOffset: 0.2, speed: 0.9, tiltX: 0.35, tiltZ: 0.55, phase: 3.35 },
  { name: "Git", src: "/img/git.svg", invert: false, radius: 1.3, yOffset: -0.4, speed: -1.05, tiltX: -0.45, tiltZ: 0.25, phase: 4.25 },
];

function useOrbitTextures() {
  const [textures, setTextures] = useState({});

  useEffect(() => {
    let isMounted = true;
    const loaded = {};

    ORBIT_ICONS.forEach((item) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        if (item.isDjango) {
          ctx.filter = "invert(0.85) sepia(1) hue-rotate(290deg) brightness(1.6)";
        } else if (item.invert) {
          ctx.filter = "invert(1) brightness(2)";
        } else {
          ctx.filter = "none";
        }

        ctx.drawImage(img, 12, 12, 104, 104);

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        loaded[item.name] = tex;

        if (isMounted) {
          setTextures((prev) => ({ ...prev, [item.name]: tex }));
        }
      };
      img.src = item.src;
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return textures;
}

// Target destinations for 3D icons when flying toward the real skill badges
// Local coordinates relative to the model group (which docks at X = +1.65, Y = -1.38 in Skills section)
const SKILL_TARGETS = {
  // Front End row (top of skills list)
  "HTML5": { x: -4.2, y: 2.25, z: 0.15 },
  "CSS3": { x: -3.7, y: 2.25, z: 0.15 },
  "JavaScript": { x: -3.2, y: 2.25, z: 0.15 },
  "React": { x: -2.7, y: 2.25, z: 0.15 },
  "Next.js": { x: -2.2, y: 2.25, z: 0.15 },
  "Tailwind": { x: -1.7, y: 2.25, z: 0.15 },
  // Back End row
  "Express": { x: -4.2, y: 1.55, z: 0.15 },
  "Node.js": { x: -3.5, y: 1.55, z: 0.15 },
  "Python": { x: -2.8, y: 1.55, z: 0.15 },
  "Django": { x: -2.1, y: 1.55, z: 0.15 },
  // Databases row
  "MongoDB": { x: -4.2, y: 0.85, z: 0.15 },
  // Tools row
  "Git": { x: -4.2, y: 0.15, z: 0.15 },
};

// 3D Messy Orbiting Tech Icons Component (Simple, clean, no bobble effect)
function OrbitingTechIcons({ iconsRotationProgress, projectsSlideProgress, skillsProgress }) {
  const textures = useOrbitTextures();
  const itemsRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const progress = iconsRotationProgress ? iconsRotationProgress.current : 0;
    // Scale up smoothly at sliding icons banner and keep visible & rotating throughout Projects section
    const pEnter = THREE.MathUtils.smoothstep(progress, 0, 0.4);
    const activeScale = pEnter;

    const sProgress = skillsProgress ? skillsProgress.current : 0;

    // Once fully in skills section or beyond, hide all rotating icons completely
    if (sProgress >= 1) {
      ORBIT_ICONS.forEach((_, idx) => {
        const group = itemsRef.current[idx];
        if (group) {
          group.scale.setScalar(0);
          group.visible = false;
        }
      });
      return;
    }

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    ORBIT_ICONS.forEach((config, idx) => {
      const group = itemsRef.current[idx];
      if (!group) return;

      // Clean, steady orbital trajectory without bobble effect
      const angle = time * config.speed * 0.75 + config.phase;
      const rawX = Math.cos(angle) * config.radius;
      const rawZ = Math.sin(angle) * config.radius;
      // Steady vertical offset (no bobble)
      const rawY = config.yOffset;

      // 3D Orbital Plane Tilt (Messy / multi-planar)
      const cosX = Math.cos(config.tiltX);
      const sinX = Math.sin(config.tiltX);
      const y1 = rawY * cosX - rawZ * sinX;
      const z1 = rawY * sinX + rawZ * cosX;

      const cosZ = Math.cos(config.tiltZ);
      const sinZ = Math.sin(config.tiltZ);
      const orbitX = rawX * cosZ - y1 * sinZ;
      const orbitY = rawX * sinZ + y1 * cosZ;
      const orbitZ = z1;

      if (sProgress <= 0) {
        // Normal orbit during projects section
        group.visible = true;
        group.scale.setScalar(activeScale);
        group.position.set(orbitX, orbitY, orbitZ);
      } else {
        // Transition: Break out of orbit, fly toward real icon on the left, merge and hide
        const rawTarget = SKILL_TARGETS[config.name] || { x: -3.8, y: 1.5, z: 0.15 };
        const targetX = isDesktop ? rawTarget.x : rawTarget.x * 0.35;
        const targetY = rawTarget.y;
        const targetZ = rawTarget.z;

        // Stagger departure for a smooth, fluid stream of icons
        const stagger = (idx / ORBIT_ICONS.length) * 0.28;
        const rawT = THREE.MathUtils.clamp((sProgress - stagger) / (1 - 0.28), 0, 1);
        const flightT = rawT * rawT * (3 - 2 * rawT);

        // 3D arc trajectory toward real icon
        const arcZ = Math.sin(flightT * Math.PI) * 0.45;
        const curX = THREE.MathUtils.lerp(orbitX, targetX, flightT);
        const curY = THREE.MathUtils.lerp(orbitY, targetY, flightT);
        const curZ = THREE.MathUtils.lerp(orbitZ, targetZ, flightT) + arcZ;

        // Shrink into the real icon badge upon arrival and hide
        const shrink = THREE.MathUtils.smoothstep(flightT, 0.62, 1.0);
        const curScale = activeScale * (1 - shrink);

        if (curScale <= 0.005) {
          group.scale.setScalar(0);
          group.visible = false;
        } else {
          group.visible = true;
          group.scale.setScalar(curScale);
          group.position.set(curX, curY, curZ);
        }
      }
    });
  });

  return (
    <group>
      {ORBIT_ICONS.map((item, idx) => {
        const tex = textures[item.name];
        return (
          <group
            key={item.name}
            ref={(el) => (itemsRef.current[idx] = el)}
            scale={[0, 0, 0]}
          >
            <Billboard>
              {/* Clean, simple circular glass badge */}
              <mesh position={[0, 0, -0.008]}>
                <circleGeometry args={[0.13, 32]} />
                <meshBasicMaterial
                  color="#120626"
                  transparent
                  opacity={0.88}
                  depthWrite={false}
                />
              </mesh>
              {/* Subtle glowing purple ring */}
              <mesh position={[0, 0, -0.004]}>
                <ringGeometry args={[0.12, 0.132, 32]} />
                <meshBasicMaterial
                  color="#a855f7"
                  transparent
                  opacity={0.85}
                  depthWrite={false}
                />
              </mesh>
              {/* Tech Icon Sprite */}
              {tex && (
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[0.175, 0.175]} />
                  <meshBasicMaterial
                    map={tex}
                    transparent
                    opacity={0.98}
                    depthWrite={false}
                  />
                </mesh>
              )}
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

const ALLOWED_MATCAPS = [
  {
    id: "mat-5",
    name: "mat-5",
    section: "Welcome",
    file: "/matcap/mat-5.png",
    auraColor: "#e0e7ff",
    description: "Welcome Section",
  },
  {
    id: "mat-7",
    name: "mat-7",
    section: "Hero",
    file: "/matcap/mat-7.png",
    auraColor: "#c084fc",
    description: "Hero Section",
  },
  {
    id: "mat-18",
    name: "mat-18",
    section: "Experience",
    file: "/matcap/mat-18.png",
    auraColor: "#fb7185",
    description: "Work Experience",
  },
  {
    id: "mat-19",
    name: "mat-19",
    section: "Projects",
    file: "/matcap/mat-19.png",
    auraColor: "#fbbf24",
    description: "Projects Section",
  },
];

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-zinc-300 text-xs font-medium gap-2">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="whitespace-nowrap">{Math.round(progress)}% loaded</p>
      </div>
    </Html>
  );
}

function Model({
  shiftProgress,
  experienceProgress,
  experienceHoldScroll,
  centerProgress,
  iconsRotationProgress,
  projectsSlideProgress,
  projectTargetX,
  projectSpinY,
  projectBankZ,
  projectsProgress,
  skillsProgress,
  headZoomProgress,
  selectedMatcap = "/matcap/mat-5.png",
}) {
  const groupRef = useRef(null);
  const gltf = useGLTF("/model/scene.gltf");
  const { actions } = useAnimations(gltf.animations, groupRef);
  const initialMatcap = useTexture("/matcap/mat-5.png");
  const currentTextureRef = useRef(initialMatcap);
  const texturesRef = useRef({});

  const materialsRef = useRef([]);
  const auraLightRef = useRef(null);

  // Pre-cache all 4 allowed textures for 0ms, seamless switching
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    ALLOWED_MATCAPS.forEach((item) => {
      loader.load(item.file, (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        texturesRef.current[item.file] = loadedTex;
      });
    });
  }, []);

  useEffect(() => {
    if (gltf.scene) {
      materialsRef.current = [];
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = false;
          const prevMat = child.material;
          const newMat = new THREE.MeshMatcapMaterial({
            matcap: currentTextureRef.current || initialMatcap,
            skinning: !!child.isSkinnedMesh,
            map: prevMat?.map || null,
            normalMap: prevMat?.normalMap || null,
            color: new THREE.Color("#ffffff"),
          });
          child.material = newMat;
          materialsRef.current.push(newMat);
        }
      });
    }
  }, [gltf.scene, initialMatcap]);

  // Instantaneous texture swapping when section or selectedMatcap changes
  useEffect(() => {
    if (!selectedMatcap || materialsRef.current.length === 0) return;

    const applyTexture = (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      currentTextureRef.current = tex;
      materialsRef.current.forEach((mat) => {
        mat.matcap = tex;
        mat.needsUpdate = true;
      });
    };

    if (texturesRef.current[selectedMatcap]) {
      applyTexture(texturesRef.current[selectedMatcap]);
    } else {
      const loader = new THREE.TextureLoader();
      loader.load(selectedMatcap, (loadedTex) => {
        texturesRef.current[selectedMatcap] = loadedTex;
        applyTexture(loadedTex);
      });
    }
  }, [selectedMatcap]);

  useEffect(() => {
    if (actions) {
      const actionNames = Object.keys(actions);
      if (actionNames.length > 0) {
        const action = actions["Armature|ActionPose"] || actions[actionNames[0]];
        action?.reset().fadeIn(0.5).play();
      }
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      const pProj = projectsProgress ? THREE.MathUtils.smoothstep(projectsProgress.current, 0, 1) : 0;
      const pCenter = centerProgress ? THREE.MathUtils.smoothstep(centerProgress.current, 0, 1) : 0;
      const pSlide = projectsSlideProgress ? THREE.MathUtils.smoothstep(projectsSlideProgress.current, 0, 1) : 0;

      // Hero stance: smoothly shift from middle (0) to left (-1.65) on scroll
      const heroShift = THREE.MathUtils.smoothstep(shiftProgress.current, 0, 1);
      const heroX = isDesktop ? -1.65 * heroShift : 0;
      // Experience stance: glide across to right (+1.85) to stand clearly to the right of work experience
      const expProgress = experienceProgress.current;
      const expX = isDesktop ? THREE.MathUtils.lerp(heroX, 1.85, expProgress) : 0;
      // Come smoothly from right to center (0) at sliding icons banner
      const centeredX = isDesktop ? THREE.MathUtils.lerp(expX, 0, pCenter) : 0;

      // Projects: dynamic left and right sliding at each project card (-2.40 for Left, +2.40 for Right)
      const dynamicProjX = projectTargetX ? projectTargetX.current : -2.40;
      const targetX = isDesktop
        ? THREE.MathUtils.lerp(centeredX, dynamicProjX, pSlide)
        : THREE.MathUtils.lerp(0, dynamicProjX * 0.5, pSlide);

      const pSkills = skillsProgress ? THREE.MathUtils.smoothstep(skillsProgress.current, 0, 1) : 0;

      // Rotation choreography:
      // Hero -> Experience: full 360-degree spin as it travels across to the right
      const spin = -expProgress * Math.PI * 2;
      const cardLookAngle = -0.45 + (experienceHoldScroll.current * 0.4);
      // Projects: dynamic rotation with full 360-degree spin while sliding left to right between cards
      const projLookAngle = Math.abs(dynamicProjX) < 0.08 ? 0 : (dynamicProjX < 0 ? 0.28 : -0.28);
      const curProjSpin = projectSpinY ? projectSpinY.current : 0;
      const projRotY = Math.sin(state.clock.elapsedTime * 0.4) * 0.06 + projLookAngle + curProjSpin;
      const targetRotY = THREE.MathUtils.lerp(spin + (cardLookAngle * expProgress), projRotY, pCenter);

      // Dynamic banking lean during transit & dynamic tilt in Skills section
      const curProjBank = projectBankZ ? projectBankZ.current : 0;
      const baseRotZ = isDesktop
        ? pCenter > 0.99
          ? curProjBank
          : Math.sin(expProgress * Math.PI) * -0.08 * (1 - pCenter)
        : 0;

      const baseScale = isDesktop ? 1.05 : 0.85;
      const skillsScale = isDesktop ? 1.42 : 1.10;
      const targetSkillsY = -1.42;

      const pHead = headZoomProgress ? THREE.MathUtils.smoothstep(headZoomProgress.current, 0, 1) : 0;

      // In Skills section: stylish dynamic hero tilt (leaning angle towards skills, straightens when centered in Education)
      const centerFactor = THREE.MathUtils.clamp(Math.abs(dynamicProjX) / 1.38, 0, 1);
      const skillsTiltZ = isDesktop ? 0.18 : 0.10;
      const skillsTiltX = isDesktop ? 0.08 : 0.04;
      const targetRotZ = THREE.MathUtils.lerp(baseRotZ, skillsTiltZ * centerFactor, pSkills);
      const targetRotX = THREE.MathUtils.lerp(0, skillsTiltX, pSkills);
      const finalRotZ = THREE.MathUtils.lerp(targetRotZ, 0, pHead);
      const finalRotX = THREE.MathUtils.lerp(targetRotX, 0, pHead);

      // Face-Centered Zoom Choreography:
      // Stage 1 (0 -> 0.45): Zooms directly into the character's face, face clearly visible & centered
      // Stage 2 (0.45 -> 1.0): Holds the face centered as the full-screen footer emerges directly from the face!
      let headScale, targetZ, headYOffset;
      const portraitScale = isDesktop ? 3.0 : 2.2;
      const portraitZ = 0.45;
      const headLocalY = 1.88;
      const startingHeadWorldY = targetSkillsY + headLocalY * skillsScale;

      if (pHead < 0.45) {
        const t1 = pHead / 0.45;
        const ease1 = THREE.MathUtils.smoothstep(t1, 0, 1);
        headScale = THREE.MathUtils.lerp(skillsScale, portraitScale, ease1);
        targetZ = THREE.MathUtils.lerp(0, portraitZ, ease1);
        const headTargetWorldY = THREE.MathUtils.lerp(startingHeadWorldY, -0.06, ease1);
        headYOffset = headTargetWorldY - headLocalY * headScale;
      } else {
        headScale = portraitScale;
        targetZ = portraitZ;
        headYOffset = -0.06 - headLocalY * headScale;
      }

      const normalScale = THREE.MathUtils.lerp(baseScale, skillsScale, pSkills);
      const targetScale = pHead > 0 ? headScale : normalScale;

      // Vertical Y positioning:
      const bannerShiftY = THREE.MathUtils.lerp(-0.90, -1.02, pCenter);
      const targetProjectY = -1.38;
      const skillsBaseY = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(bannerShiftY, targetProjectY, pSlide),
        targetSkillsY,
        pSkills
      );
      const baseY = pHead > 0 ? headYOffset : skillsBaseY;
      const scrollDownY = -pProj * 0.15;
      const curScrollDown = (1 - pHead) * scrollDownY;
      const floatY = baseY + curScrollDown + Math.sin(state.clock.elapsedTime * 1.5) * 0.03 * (1 - pHead);

      // Ensure mesh colors stay pure white so mat-5, mat-7, mat-18, mat-19 display authentic tones
      for (let i = 0; i < materialsRef.current.length; i++) {
        materialsRef.current[i].color.set("#ffffff");
      }

      // Dynamic Attached Glowing Aura Light synchronized to active section matcap
      const activeItem = ALLOWED_MATCAPS.find((m) => m.file === selectedMatcap) || ALLOWED_MATCAPS[0];
      const targetAura = new THREE.Color(activeItem.auraColor);
      const pulse = Math.sin(state.clock.elapsedTime * 2.8) * 0.2;

      if (auraLightRef.current) {
        auraLightRef.current.color.lerp(targetAura, 0.1);
        const baseIntensity = THREE.MathUtils.lerp(1.2, 3.2, expProgress);
        auraLightRef.current.intensity = THREE.MathUtils.damp(
          auraLightRef.current.intensity,
          baseIntensity + pulse,
          4,
          delta
        );
      }

      // Fast, snappy damping (12.0) so model slides quickly between left and right at projects
      const dampSpeed = pHead > 0 ? 8.0 : (pSlide > 0.01 || pProj > 0.01 ? 12.0 : 5.0);

      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetX,
        dampSpeed,
        delta
      );

      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        floatY,
        dampSpeed,
        delta
      );

      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetZ,
        dampSpeed,
        delta
      );

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        finalRotX,
        dampSpeed,
        delta
      );

      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        dampSpeed,
        delta
      );

      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        finalRotZ,
        dampSpeed,
        delta
      );

      const curScale = groupRef.current.scale.x;
      const nextScale = THREE.MathUtils.damp(curScale, targetScale, dampSpeed, delta);
      groupRef.current.scale.setScalar(nextScale);

      // Once footer takes over full screen, hide model cleanly
      groupRef.current.visible = pHead < 0.88;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.9, 0]}>
      {/* Dynamic Glowing Core Light that travels with the character */}
      <pointLight
        ref={auraLightRef}
        position={[0, 0.3, 0.9]}
        distance={4.5}
        decay={2}
        intensity={0.8}
        color="#ffffff"
      />
      {/* Back rim aura light for glowing silhouette */}
      <pointLight
        position={[0, 0.6, -0.9]}
        distance={3.5}
        decay={2}
        intensity={1.5}
        color="#c084fc"
      />
      <primitive object={gltf.scene} />

      {/* Orbiting Messy 3D Tech Icons Cloud */}
      <OrbitingTechIcons
        iconsRotationProgress={iconsRotationProgress}
        projectsSlideProgress={projectsSlideProgress}
        skillsProgress={skillsProgress}
      />
    </group>
  );
}

// Camera controller: tilts from Top to Front, frames experience, and subtly tracks descending character
function ScrollCameraController({ tiltProgress, experienceProgress, projectsProgress }) {
  const { camera } = useThree();

  const topPos = useRef(new THREE.Vector3(0, 3.8, 0.3));
  const frontPos = useRef(new THREE.Vector3(0, 0.1, 3.6));
  const expPos = useRef(new THREE.Vector3(0.25, 0.15, 3.75));
  const lookTarget = useRef(new THREE.Vector3(0, -0.05, 0));
  const currentTarget = useRef(new THREE.Vector3(0, 3.8, 0.3));

  useFrame((state, delta) => {
    const basePos = new THREE.Vector3().lerpVectors(topPos.current, frontPos.current, tiltProgress.current);
    currentTarget.current.lerpVectors(basePos, expPos.current, experienceProgress.current);

    const pProj = projectsProgress ? projectsProgress.current : 0;
    const lookTargetY = THREE.MathUtils.lerp(-0.05, -0.12, pProj);
    lookTarget.current.set(0, lookTargetY, 0);

    const step = Math.min(delta * 4, 0.2);
    camera.position.lerp(currentTarget.current, step);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

useGLTF.preload("/model/scene.gltf");
useTexture.preload("/matcap/mat-5.png");
useTexture.preload("/matcap/mat-7.png");
useTexture.preload("/matcap/mat-18.png");
useTexture.preload("/matcap/mat-19.png");

// Evaluates precise target X coordinate, dynamic spin, and banking lean across project cards
const PROJ_LEFT_X = -2.40;
const PROJ_RIGHT_X = 2.05;
const SKILLS_MODEL_X = 1.38;

function getProjectState(scrollY) {
  // Completely centered at middle (0) during horizontal display (sliding icons banner up to 3050px)
  if (scrollY < 3050) {
    return { targetX: 0, spinY: 0, bankZ: 0 };
  }

  // Transition into Vertical Display - Project 1 (iTask Manager: Left side): 3050px -> 3350px
  if (scrollY < 3350) {
    const t = Math.min(Math.max((scrollY - 3050) / 300, 0), 1);
    const easeT = t * t * (3 - 2 * t);
    const x = THREE.MathUtils.lerp(0, PROJ_LEFT_X, easeT);
    const bank = Math.sin(t * Math.PI) * 0.08;
    return { targetX: x, spinY: 0, bankZ: bank };
  }

  // Project 1 (iTask: Left side) hold: 3350px -> 3600px
  if (scrollY < 3600) {
    return { targetX: PROJ_LEFT_X, spinY: 0, bankZ: 0 };
  }

  // Dynamic Slide: Project 1 (Left) -> Project 2 (Right) with full 360° spin: 3600px -> 3850px
  if (scrollY < 3850) {
    const t = Math.min(Math.max((scrollY - 3600) / 250, 0), 1);
    const easeT = t * t * (3 - 2 * t);
    const x = THREE.MathUtils.lerp(PROJ_LEFT_X, PROJ_RIGHT_X, easeT);
    // Smooth 360-degree rotation during left-to-right transit
    const spin = -easeT * Math.PI * 2;
    // Aerodynamic banking lean into the transit curve
    const bank = Math.sin(t * Math.PI) * -0.16;
    return { targetX: x, spinY: spin, bankZ: bank };
  }

  // Project 2 (Get Me a Chai: Right side) hold: 3850px -> 4100px (Centered at 3952px)
  if (scrollY < 4100) {
    return { targetX: PROJ_RIGHT_X, spinY: -Math.PI * 2, bankZ: 0 };
  }

  // Dynamic Slide: Project 2 (Right) -> Project 3 (Left) with spin: 4100px -> 4350px
  if (scrollY < 4350) {
    const t = Math.min(Math.max((scrollY - 4100) / 250, 0), 1);
    const easeT = t * t * (3 - 2 * t);
    const x = THREE.MathUtils.lerp(PROJ_RIGHT_X, PROJ_LEFT_X, easeT);
    const spin = -Math.PI * 2 + easeT * Math.PI * 2;
    const bank = Math.sin(t * Math.PI) * 0.16;
    return { targetX: x, spinY: spin, bankZ: bank };
  }

  // Project 3 (LinkTree: Left side) hold: 4350px -> 4600px (Centered at 4450px)
  if (scrollY < 4600) {
    return { targetX: PROJ_LEFT_X, spinY: 0, bankZ: 0 };
  }

  // Dynamic Slide: Project 3 (Left) -> Project 4 (Right) with spin: 4600px -> 4850px
  if (scrollY < 4850) {
    const t = Math.min(Math.max((scrollY - 4600) / 250, 0), 1);
    const easeT = t * t * (3 - 2 * t);
    const x = THREE.MathUtils.lerp(PROJ_LEFT_X, PROJ_RIGHT_X, easeT);
    const spin = -easeT * Math.PI * 2;
    const bank = Math.sin(t * Math.PI) * -0.16;
    return { targetX: x, spinY: spin, bankZ: bank };
  }

  // Project 4 (BitLinks: Right side) hold: 4850px -> 5100px (Centered at 4950px)
  if (scrollY < 5100) {
    return { targetX: PROJ_RIGHT_X, spinY: -Math.PI * 2, bankZ: 0 };
  }

  // Dynamic Slide: Project 4 (Right) -> Project 5 (Left) with spin: 5100px -> 5350px
  if (scrollY < 5350) {
    const t = Math.min(Math.max((scrollY - 5100) / 250, 0), 1);
    const easeT = t * t * (3 - 2 * t);
    const x = THREE.MathUtils.lerp(PROJ_RIGHT_X, PROJ_LEFT_X, easeT);
    const spin = -Math.PI * 2 + easeT * Math.PI * 2;
    const bank = Math.sin(t * Math.PI) * 0.16;
    return { targetX: x, spinY: spin, bankZ: bank };
  }

  // Project 5 (PassSecure: Left side) hold: 5350px -> 5600px (Centered at 5450px)
  if (scrollY < 5600) {
    return { targetX: PROJ_LEFT_X, spinY: 0, bankZ: 0 };
  }

  // Dynamic Slide: Project 5 (Left) -> Skills Section (Right): 5600px -> 5850px with 360° spin
  if (scrollY < 5850) {
    const t = Math.min(Math.max((scrollY - 5600) / 250, 0), 1);
    const easeT = t * t * (3 - 2 * t);
    const x = THREE.MathUtils.lerp(PROJ_LEFT_X, SKILLS_MODEL_X, easeT);
    const spin = -easeT * Math.PI * 2;
    const bank = Math.sin(t * Math.PI) * -0.16;
    return { targetX: x, spinY: spin, bankZ: bank };
  }

  // Skills Section: Model docks comfortably facing left toward skills: 5850px -> 6450px
  if (scrollY < 6450) {
    return { targetX: SKILLS_MODEL_X, spinY: -Math.PI * 2, bankZ: 0 };
  }

  // 50% Gap & Transition into Education: Model rotates 50% (180° / half-turn) and glides into center: 6450px -> 7050px
  if (scrollY < 7050) {
    const t = Math.min(Math.max((scrollY - 6450) / 600, 0), 1);
    const easeT = t * t * (3 - 2 * t);
    const x = THREE.MathUtils.lerp(SKILLS_MODEL_X, 0, easeT);
    const spin = -Math.PI * 2 - easeT * Math.PI;
    return { targetX: x, spinY: spin, bankZ: 0 };
  }

  // Education Section hold: 7050px -> 7350px (Centered at 0, 50% rotated)
  if (scrollY < 7350) {
    return { targetX: 0, spinY: -Math.PI * 3, bankZ: 0 };
  }

  // Smoothly rotate around to face forward (-Math.PI * 4) so the FACE IS CLEARLY VISIBLE
  if (scrollY < 7800) {
    const tRot = Math.min(Math.max((scrollY - 7350) / 450, 0), 1);
    const easeRot = tRot * tRot * (3 - 2 * tRot);
    const spin = -Math.PI * 3 - easeRot * Math.PI;
    return { targetX: 0, spinY: spin, bankZ: 0 };
  }

  // Hold facing forward so the face remains visible as the footer emerges from the face!
  return { targetX: 0, spinY: -Math.PI * 4, bankZ: 0 };
}

export default function CanvasScene() {
  const [selectedMatcap, setSelectedMatcap] = useState("/matcap/mat-5.png");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const currentMatcapRef = useRef("/matcap/mat-5.png");

  const tiltProgress = useRef(0);
  const shiftProgress = useRef(0);
  const experienceProgress = useRef(0);
  const experienceHoldScroll = useRef(0);
  const centerProgress = useRef(0);
  const iconsRotationProgress = useRef(0);
  const projectsSlideProgress = useRef(0);
  const projectTargetX = useRef(0);
  const projectSpinY = useRef(0);
  const projectBankZ = useRef(0);
  const projectsProgress = useRef(0);
  const skillsProgress = useRef(0);
  const headZoomProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Phase 1: Swoop from Top to Front over 0px -> 320px
      tiltProgress.current = Math.min(Math.max(scrollY / 320, 0), 1);
      // Phase 2: Shift from Center (Mid) to Left over 0px -> 450px
      shiftProgress.current = Math.min(Math.max(scrollY / 450, 0), 1);
      // Phase 3: Move to Right & Rotate over 850px -> 1500px (synced with experience section)
      experienceProgress.current = Math.min(Math.max((scrollY - 850) / 650, 0), 1);
      // Phase 4: Dynamic rotation while in Experience section over 1500px -> 2300px
      experienceHoldScroll.current = Math.min(Math.max((scrollY - 1500) / 800, 0), 1);
      // Phase 5: Move from Right to Center as user approaches the sliding icons banner (2100px -> 2550px)
      centerProgress.current = Math.min(Math.max((scrollY - 2100) / 450, 0), 1);
      // Phase 6: Icon rotation at model runs at sliding icons banner (2400px -> 3000px)
      iconsRotationProgress.current = Math.min(Math.max((scrollY - 2400) / 500, 0), 1);
      // Phase 7: Projects slide progress (triggers lift & left slide as leaving banner into projects over 3050px -> 3350px)
      projectsSlideProgress.current = Math.min(Math.max((scrollY - 3050) / 300, 0), 1);
      // Dynamic Projects X position & rotation (slides between left and right with rotation)
      const projState = getProjectState(scrollY);
      projectTargetX.current = projState.targetX;
      projectSpinY.current = projState.spinY;
      projectBankZ.current = projState.bankZ;
      // Phase 8: Projects section scroll-down over 3350px -> 6800px
      projectsProgress.current = Math.min(Math.max((scrollY - 3350) / 3500, 0), 1);
      // Phase 9: Skills section transition: 5550px -> 5850px (orbiting icons fly to real skill badges and hide)
      skillsProgress.current = Math.min(Math.max((scrollY - 5550) / 300, 0), 1);
      // Phase 10: Face zoom and footer emergence over 7350px -> 8400px
      headZoomProgress.current = Math.min(Math.max((scrollY - 7350) / 950, 0), 1);

      // --- SECTION-BASED MATCAP AUTOMATION ---
      // Welcome Section (0 - 200px): mat-5 (Pearl Silver)
      // Hero Section (200px - 850px): mat-7 (Neon Violet)
      // Experience Section (850px - 2550px): mat-18 (Sunset Amber)
      // Sliding Icons & Projects Section (2550px+): mat-19 (Polished Gold)
      let activeMatcap = "/matcap/mat-5.png";
      if (scrollY >= 2550) {
        activeMatcap = "/matcap/mat-19.png";
      } else if (scrollY >= 850) {
        activeMatcap = "/matcap/mat-18.png";
      } else if (scrollY >= 200) {
        activeMatcap = "/matcap/mat-7.png";
      } else {
        activeMatcap = "/matcap/mat-5.png";
      }

      if (activeMatcap !== currentMatcapRef.current) {
        currentMatcapRef.current = activeMatcap;
        setSelectedMatcap(activeMatcap);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeMatcapConfig = ALLOWED_MATCAPS.find((m) => m.file === selectedMatcap) || ALLOWED_MATCAPS[0];

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 3.8, 0.3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        {/* Overhead light for top-down view */}
        <directionalLight position={[0, 8, 2]} intensity={2.5} />
        {/* Front key light for front view */}
        <directionalLight position={[3, 4, 4]} intensity={2.2} />
        {/* Rim back light */}
        <directionalLight position={[-3, 4, -3]} intensity={1.5} color="#818cf8" />
        <pointLight position={[0, 1, 2]} intensity={1.0} />

        <Suspense fallback={<Loader />}>
          <Model
            shiftProgress={shiftProgress}
            experienceProgress={experienceProgress}
            experienceHoldScroll={experienceHoldScroll}
            centerProgress={centerProgress}
            iconsRotationProgress={iconsRotationProgress}
            projectsSlideProgress={projectsSlideProgress}
            projectTargetX={projectTargetX}
            projectSpinY={projectSpinY}
            projectBankZ={projectBankZ}
            projectsProgress={projectsProgress}
            skillsProgress={skillsProgress}
            headZoomProgress={headZoomProgress}
            selectedMatcap={selectedMatcap}
          />
        </Suspense>

        <ScrollCameraController
          tiltProgress={tiltProgress}
          experienceProgress={experienceProgress}
          projectsProgress={projectsProgress}
        />
      </Canvas>

      {/* Floating Section MatCap Switcher (Allowed: mat-5, mat-7, mat-18, mat-19) */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto flex flex-col items-start gap-2">
        {isPickerOpen ? (
          <div className="bg-zinc-950/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-zinc-200 tracking-wide">
                  Section MatCaps (4)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="text-zinc-400 hover:text-white text-xs p-1 rounded-md hover:bg-white/10 transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {ALLOWED_MATCAPS.map((item) => {
                const isActive = selectedMatcap === item.file;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      currentMatcapRef.current = item.file;
                      setSelectedMatcap(item.file);
                    }}
                    className={`group relative flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${isActive
                      ? "bg-purple-600/25 border-purple-400/80 shadow-lg shadow-purple-500/20 scale-[1.02]"
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
                      }`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white/25 shadow-md bg-black shrink-0">
                      <img
                        src={item.file}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate">
                        {item.id}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono truncate">
                        {item.section}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-zinc-400 text-center pt-1 border-t border-white/5">
              Changes automatically as you scroll through sections
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-zinc-950/85 backdrop-blur-md border border-purple-500/30 hover:border-purple-400/60 shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30 shadow bg-black shrink-0">
              <img
                src={selectedMatcap}
                alt="Active MatCap"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-400">MatCap:</span>
              <span className="font-semibold text-purple-300">
                {activeMatcapConfig.id}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                ({activeMatcapConfig.section})
              </span>
            </div>
            <span className="text-zinc-400 text-[10px] group-hover:translate-y-0.5 transition-transform">
              ▾
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
