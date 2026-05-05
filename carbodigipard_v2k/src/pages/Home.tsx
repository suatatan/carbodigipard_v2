import HeroSection from '@/sections/HeroSection';
import ProjectInfoSection from '@/sections/ProjectInfoSection';
import NewsCarouselSection from '@/sections/NewsCarouselSection';
import PartnersSection from '@/sections/PartnersSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectInfoSection />
      <NewsCarouselSection />
      <PartnersSection />
    </main>
  );
}
