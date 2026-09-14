"use client";

import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Html, useProgress, Billboard } from "@react-three/drei";
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

        // Soft, borderless atmospheric radial aura behind the icon
        const radGrad = ctx.createRadialGradient(64, 64, 8, 64, 64, 56);
        radGrad.addColorStop(0, "rgba(147, 51, 234, 0.28)");
        radGrad.addColorStop(0.55, "rgba(113, 39, 186, 0.10)");
        radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(64, 64, 56, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric Depth-of-Field Blur on the icon (borderless, dreamy bokeh)
        let filterStr = "blur(2.6px)";
        if (item.isDjango) {
          filterStr = "invert(0.85) sepia(1) hue-rotate(290deg) brightness(1.6) blur(2.6px)";
        } else if (item.invert) {
          filterStr = "invert(1) brightness(1.9) blur(2.6px)";
        }
        ctx.filter = filterStr;

        // Draw icon centered with soft blur
        ctx.drawImage(img, 20, 20, 88, 88);

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
              {/* Borderless, dreamy blurred floating tech icon */}
              {tex && (
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[0.26, 0.26]} />
                  <meshBasicMaterial
                    map={tex}
                    transparent
                    opacity={0.86}
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

// Configurable translucent MatCap opacity so underlying jacket and clothing textures remain visible
const MAX_MATCAP_OPACITY = 0.40;

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
  selectedMatcap = null,
}) {
  const groupRef = useRef(null);
  const gltf = useGLTF("/model/scene.gltf");
  const { actions } = useAnimations(gltf.animations, groupRef);
  const texturesRef = useRef({});
  const auraLightRef = useRef(null);

  // 1x1 dummy fallback texture for samplers before matcap is loaded
  const dummyTex = useMemo(() => {
    const tex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Shared uniforms across all model materials for zero-overhead, 60fps GPU blending
  const matcapUniforms = useMemo(() => ({
    uMatcapA: { value: dummyTex },
    uMatcapB: { value: dummyTex },
    uMatcapStrength: { value: 0.0 },
    uMatcapCrossfade: { value: 0.0 },
  }), [dummyTex]);

  const targetStrengthRef = useRef(0.0);
  const activeSlotRef = useRef("A");

  // Pre-cache all allowed textures for 0ms, seamless switching
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    ALLOWED_MATCAPS.forEach((item) => {
      loader.load(item.file, (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        texturesRef.current[item.file] = loadedTex;
      });
    });
  }, []);

  // Enhance original PBR materials with a smooth MatCap blending layer via onBeforeCompile
  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = false;
          const mat = child.material;

          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uMatcapA = matcapUniforms.uMatcapA;
            shader.uniforms.uMatcapB = matcapUniforms.uMatcapB;
            shader.uniforms.uMatcapStrength = matcapUniforms.uMatcapStrength;
            shader.uniforms.uMatcapCrossfade = matcapUniforms.uMatcapCrossfade;

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
uniform sampler2D uMatcapA;
uniform sampler2D uMatcapB;
uniform float uMatcapStrength;
uniform float uMatcapCrossfade;
`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <opaque_fragment>',
              `
vec3 mcViewDir = normalize( vViewPosition );
vec3 mcX = normalize( vec3( mcViewDir.z, 0.0, - mcViewDir.x ) );
vec3 mcY = cross( mcViewDir, mcX );
vec2 mcUv = vec2( dot( mcX, normal ), dot( mcY, normal ) ) * 0.495 + 0.5;

vec4 mcColorA = sRGBTransferEOTF( texture2D( uMatcapA, mcUv ) );
vec4 mcColorB = sRGBTransferEOTF( texture2D( uMatcapB, mcUv ) );
vec3 blendedMc = mix( mcColorA.rgb, mcColorB.rgb, uMatcapCrossfade );

// Preserve the authentic base textures (jacket, pants, normal maps) under the matcap sheen
vec3 texturedMatcap = outgoingLight * blendedMc * 1.45;
vec3 matcapOverlay = mix( blendedMc, texturedMatcap, 0.70 );

outgoingLight = mix( outgoingLight, matcapOverlay, uMatcapStrength );
#include <opaque_fragment>
`
            );
          };

          mat.customProgramCacheKey = () => "matcap_blended_standard_v3";
          mat.needsUpdate = true;
        }
      });
    }
  }, [gltf.scene, matcapUniforms]);

  // Softly trigger target strength and crossfade slots when selectedMatcap changes
  useEffect(() => {
    if (!selectedMatcap) {
      // Softly dissolve back to authentic default material (0% opacity)
      targetStrengthRef.current = 0.0;
      return;
    }

    const setTextureToSlot = (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (targetStrengthRef.current === 0.0) {
        // First hover: load into Slot A, set crossfade to 0
        matcapUniforms.uMatcapA.value = tex;
        matcapUniforms.uMatcapCrossfade.value = 0.0;
        activeSlotRef.current = "A";
      } else {
        // Switching between cards: crossfade between A and B
        if (activeSlotRef.current === "A") {
          matcapUniforms.uMatcapB.value = tex;
          activeSlotRef.current = "B";
        } else {
          matcapUniforms.uMatcapA.value = tex;
          activeSlotRef.current = "A";
        }
      }
      // Low opacity target so underlying textures remain clearly visible
      targetStrengthRef.current = MAX_MATCAP_OPACITY;
    };

    if (texturesRef.current[selectedMatcap]) {
      setTextureToSlot(texturesRef.current[selectedMatcap]);
    } else {
      const loader = new THREE.TextureLoader();
      loader.load(selectedMatcap, (loadedTex) => {
        texturesRef.current[selectedMatcap] = loadedTex;
        setTextureToSlot(loadedTex);
      });
    }
  }, [selectedMatcap, matcapUniforms]);

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
    // Silky smooth, soft damp of MatCap strength (0.0 <-> 1.0)
    matcapUniforms.uMatcapStrength.value = THREE.MathUtils.damp(
      matcapUniforms.uMatcapStrength.value,
      targetStrengthRef.current,
      3.2,
      delta
    );

    // Silky smooth damp of crossfade between cards (0.0 <-> 1.0)
    const targetCrossfade = activeSlotRef.current === "A" ? 0.0 : 1.0;
    matcapUniforms.uMatcapCrossfade.value = THREE.MathUtils.damp(
      matcapUniforms.uMatcapCrossfade.value,
      targetCrossfade,
      3.2,
      delta
    );

    if (groupRef.current) {
      const vpW = state.viewport.width;
      const screenW = state.size.width;
      const isMobile = screenW < 768;
      const isTablet = screenW >= 768 && screenW < 1024;
      const isLaptop = screenW >= 1024 && screenW < 1440;
      const isMonitor = screenW >= 1440;

      const pProj = projectsProgress ? THREE.MathUtils.smoothstep(projectsProgress.current, 0, 1) : 0;
      const pCenter = centerProgress ? THREE.MathUtils.smoothstep(centerProgress.current, 0, 1) : 0;
      const pSlide = projectsSlideProgress ? THREE.MathUtils.smoothstep(projectsSlideProgress.current, 0, 1) : 0;

      // Responsive X offsets:
      // Monitor (>=1440): full wide offset (-1.65 / +1.85)
      // Laptop (1024-1439): balanced offset (-1.35 / +1.45)
      // Tablet (768-1023): compact safe offset (-0.80 / +0.85)
      // Mobile (<768): centered (0)
      const heroTargetX = isMonitor ? -1.65 : (isLaptop ? -1.35 : (isTablet ? -0.80 : 0));
      const expTargetX = isMonitor ? 1.85 : (isLaptop ? 1.45 : (isTablet ? 0.85 : 0));
      const projScaleFactor = isMonitor ? 1.0 : (isLaptop ? 0.80 : (isTablet ? 0.40 : 0));

      // Hero stance: smoothly shift from center (0) to left (heroTargetX) as user scrolls
      const heroShift = shiftProgress ? THREE.MathUtils.smoothstep(shiftProgress.current, 0, 1) : 1;
      const heroX = THREE.MathUtils.lerp(0, heroTargetX, heroShift);
      // Experience stance: glide across to right to stand clearly beside work experience
      const expProgress = experienceProgress.current;
      const expX = THREE.MathUtils.lerp(heroX, expTargetX, expProgress);
      // Come smoothly from right to center (0) at sliding icons banner
      const centeredX = THREE.MathUtils.lerp(expX, 0, pCenter);

      // Projects: dynamic left and right sliding at each project card
      const dynamicProjX = (projectTargetX ? projectTargetX.current : -2.40) * projScaleFactor;
      const rawTargetX = THREE.MathUtils.lerp(centeredX, dynamicProjX, pSlide);
      // Ensure targetX never leaves visible screen bounds
      const maxSafeX = Math.max(vpW * 0.38, 0.4);
      const targetX = THREE.MathUtils.clamp(rawTargetX, -maxSafeX, maxSafeX);

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
      const baseRotZ = !isMobile
        ? pCenter > 0.99
          ? curProjBank
          : Math.sin(expProgress * Math.PI) * -0.08 * (1 - pCenter)
        : 0;

      // Responsive model scale tiers
      let baseScale = 1.05;
      let skillsScale = 1.42;
      let portraitScale = 3.0;

      if (isMobile) {
        baseScale = 0.72;
        skillsScale = 0.95;
        portraitScale = 2.0;
      } else if (isTablet) {
        baseScale = 0.88;
        skillsScale = 1.15;
        portraitScale = 2.4;
      } else if (isLaptop) {
        baseScale = 0.98;
        skillsScale = 1.30;
        portraitScale = 2.7;
      }

      const targetSkillsY = isMobile ? -1.50 : (isTablet ? -1.45 : -1.42);

      const pHead = headZoomProgress ? THREE.MathUtils.smoothstep(headZoomProgress.current, 0, 1) : 0;

      // In Skills section: stylish dynamic hero tilt
      const centerFactor = THREE.MathUtils.clamp(Math.abs(dynamicProjX) / 1.38, 0, 1);
      const skillsTiltZ = !isMobile ? (isTablet ? 0.10 : 0.18) : 0.05;
      const skillsTiltX = !isMobile ? 0.08 : 0.04;
      const targetRotZ = THREE.MathUtils.lerp(baseRotZ, skillsTiltZ * centerFactor, pSkills);
      const targetRotX = THREE.MathUtils.lerp(0, skillsTiltX, pSkills);
      const finalRotZ = THREE.MathUtils.lerp(targetRotZ, 0, pHead);
      const finalRotX = THREE.MathUtils.lerp(targetRotX, 0, pHead);

      // Face-Centered Zoom Choreography:
      let headScale, targetZ, headYOffset;
      const portraitZ = isMobile ? 0.25 : 0.45;
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
      const bannerShiftY = isMobile
        ? -1.18
        : (isTablet ? -1.06 : THREE.MathUtils.lerp(-0.90, -1.02, pCenter));
      const targetProjectY = isMobile ? -1.58 : (isTablet ? -1.46 : -1.38);
      const skillsBaseY = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(bannerShiftY, targetProjectY, pSlide),
        targetSkillsY,
        pSkills
      );
      const baseY = pHead > 0 ? headYOffset : skillsBaseY;
      const scrollDownY = -pProj * 0.15;
      const curScrollDown = (1 - pHead) * scrollDownY;
      const floatY = baseY + curScrollDown + Math.sin(state.clock.elapsedTime * 1.5) * 0.03 * (1 - pHead);

      // Aura Light softly tracks the matcap strength and target aura color
      if (auraLightRef.current) {
        const activeItem = selectedMatcap
          ? ALLOWED_MATCAPS.find((m) => m.file === selectedMatcap)
          : null;

        const targetAuraColor = activeItem
          ? new THREE.Color(activeItem.auraColor)
          : new THREE.Color("#818cf8");

        auraLightRef.current.color.lerp(targetAuraColor, THREE.MathUtils.clamp(delta * 3.5, 0, 1));

        const normStrength = Math.min(matcapUniforms.uMatcapStrength.value / MAX_MATCAP_OPACITY, 1.0);
        const pulse = Math.sin(state.clock.elapsedTime * 2.8) * 0.2;
        const baseIntensity = THREE.MathUtils.lerp(1.5, 3.5, expProgress);
        const targetIntensity = THREE.MathUtils.lerp(0.6, baseIntensity + pulse, normStrength);

        auraLightRef.current.intensity = THREE.MathUtils.damp(
          auraLightRef.current.intensity,
          targetIntensity,
          3.2,
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
  const { camera, size } = useThree();

  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1024;

  const topPos = useRef(new THREE.Vector3(0, 3.8, 0.3));
  const frontZ = isMobile ? 4.1 : (isTablet ? 3.85 : 3.6);
  const frontPos = useRef(new THREE.Vector3(0, 0.1, frontZ));
  const expPos = useRef(new THREE.Vector3(isMobile ? 0 : (isTablet ? 0.15 : 0.25), 0.15, frontZ + 0.15));
  const lookTarget = useRef(new THREE.Vector3(0, -0.05, 0));
  const currentTarget = useRef(new THREE.Vector3(0, 3.8, 0.3));

  useFrame((state, delta) => {
    const currentFrontZ = size.width < 768 ? 4.1 : (size.width < 1024 ? 3.85 : 3.6);
    frontPos.current.z = currentFrontZ;
    expPos.current.z = currentFrontZ + 0.15;
    expPos.current.x = size.width < 768 ? 0 : (size.width < 1024 ? 0.15 : 0.25);

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

// On mobile devices (without mouse cursor hover), automatically apply corresponding MatCaps as user scrolls through sections
function getMobileScrollMatcap(scrollY) {
  // Hero / Welcome: clean authentic model (no matcap)
  if (scrollY < 850) {
    return null;
  }
  // Work Experience Section: DRDO (Sunset Amber), Relux (Neon Violet), HashTrust (Gold)
  if (scrollY < 1450) {
    return "/matcap/mat-18.png";
  }
  if (scrollY < 2050) {
    return "/matcap/mat-7.png";
  }
  if (scrollY < 2550) {
    return "/matcap/mat-19.png";
  }
  // Sliding Marquee Banner & Project 1 (Daily)
  if (scrollY < 3600) {
    return "/matcap/mat-19.png";
  }
  // Project 2 (Content Crafter)
  if (scrollY < 4100) {
    return "/matcap/mat-18.png";
  }
  // Project 3 (Social Tree)
  if (scrollY < 4600) {
    return "/matcap/mat-7.png";
  }
  // Project 4 (Tiny Link)
  if (scrollY < 5100) {
    return "/matcap/mat-5.png";
  }
  // Project 5 (Secure Pass)
  if (scrollY < 5600) {
    return "/matcap/mat-18.png";
  }
  // Skills Section
  if (scrollY < 6450) {
    return "/matcap/mat-7.png";
  }
  // Education Section
  if (scrollY < 7350) {
    return "/matcap/mat-19.png";
  }
  // Face Zoom & Footer / Contact
  return null;
}

export default function CanvasScene() {
  const [selectedMatcap, setSelectedMatcap] = useState(null); // Default: NO MATCAP on desktop; auto on mobile scroll
  const currentMobileMatcapRef = useRef(null);

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
      const isMobile = window.innerWidth < 768;

      // On mobile devices: automatically synchronize MatCap to current scroll section
      if (isMobile) {
        const targetMobileMatcap = getMobileScrollMatcap(scrollY);
        if (targetMobileMatcap !== currentMobileMatcapRef.current) {
          currentMobileMatcapRef.current = targetMobileMatcap;
          setSelectedMatcap(targetMobileMatcap);
        }
      }

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
    };

    const handleMatcapHover = (e) => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      // On desktop: hover controls the MatCap; on mobile: scroll controls it
      if (!isMobile) {
        const matcap = e.detail;
        setSelectedMatcap(matcap || null);
      }
    };

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        currentMobileMatcapRef.current = null;
        setSelectedMatcap(null);
      } else {
        const targetMobileMatcap = getMobileScrollMatcap(window.scrollY);
        currentMobileMatcapRef.current = targetMobileMatcap;
        setSelectedMatcap(targetMobileMatcap);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("portfolio-hover-matcap", handleMatcapHover);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("portfolio-hover-matcap", handleMatcapHover);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 3.8, 0.3], fov: 45 }}
        dpr={typeof window !== "undefined" && window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
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
    </div>
  );
}

useGLTF.preload("/model/scene.gltf");
