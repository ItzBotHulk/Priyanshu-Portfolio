import CanvasScene from "@/components/CanvasScene";
import Navbar from "@/components/Navbar";
import HeroIntro from "@/components/HeroIntro";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import EducationSection from "@/components/EducationSection";
import MovingTechIcons from "@/components/MovingTechIcons";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-transparent text-zinc-100 flex flex-col items-center selection:bg-purple-500/30 relative">
      <Navbar />

      {/* 3D Canvas across the entire page (Hero -> Experience -> Projects) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <CanvasScene />
      </div>

      {/* Interactive 3D Scroll Journey: 380vh track choreographing Hero -> Experience */}
      <div className="relative w-full h-[380vh]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

          {/* Foreground Grid Container */}
          <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[1520px] 3xl:max-w-[1800px] h-full mx-auto px-4 sm:px-6 md:px-14 2xl:px-16 flex items-center justify-center pointer-events-none pt-14 sm:pt-16">

            {/* Experience Layer: Occupies Left Half (Model docks on Right on Desktop) */}
            <div className="absolute inset-0 w-full max-w-7xl 2xl:max-w-[1520px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-14 2xl:px-16 flex items-center justify-start pointer-events-none pt-14 sm:pt-16">
              <div className="w-full md:w-1/2 flex items-center justify-start">
                <ExperienceSection />
              </div>
            </div>

            {/* Hero Intro Layer: Occupies Right Half (Model docks on Left on Desktop) */}
            <div className="absolute inset-0 w-full max-w-7xl 2xl:max-w-[1520px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-14 2xl:px-16 flex items-center justify-end pointer-events-none pt-14 sm:pt-16">
              <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start 2xl:pl-6">
                <HeroIntro />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Full-width Moving Tech Icons Divider Banner */}
      <div className="w-full relative z-20">
        <MovingTechIcons scrollDriven={false} />
      </div>

      {/* Dedicated Half-Screen Gap for 3D Model & Orbiting Icons Showcase */}
      <div className="w-full h-[50vh] relative z-10 pointer-events-none" aria-hidden="true" />

      {/* Projects Section (Matching reference with Constellation canvas, frosted cards & mockups) */}
      <div className="w-full relative z-20">
        <ProjectsSection />
      </div>

      {/* Skills Section (Interactive tech badges with 3D model docked on the right) */}
      <div className="w-full relative z-20">
        <SkillsSection />
      </div>

      {/* Dedicated 50% Screen Gap for 3D Model Showcase */}
      <div className="w-full h-[50vh] relative z-10 pointer-events-none" aria-hidden="true" />

      {/* Education Section (Academic qualifications with obsidian purple glass cards) */}
      <div className="w-full relative z-20">
        <EducationSection />
      </div>

      {/* Footer & Contact Section (Emerges directly from the 3D model's face into full screen) */}
      <Footer />
    </main>
  );
}
