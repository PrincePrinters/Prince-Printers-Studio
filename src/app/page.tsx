import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DateAvailabilityChecker from '@/components/DateAvailabilityChecker';
import FeaturedFilmsSection from '@/components/FeaturedFilmsSection';
import PortfolioSection from '@/components/PortfolioSection';
import ColorGradeSliderSection from '@/components/ColorGradeSliderSection';
import DirectorStorySection from '@/components/DirectorStorySection';
import ServicesSection from '@/components/ServicesSection';
import PackagesSection from '@/components/PackagesSection';
import AiSearchPreviewSection from '@/components/AiSearchPreviewSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import InquiryFormSection from '@/components/InquiryFormSection';
import DirectorConciergePill from '@/components/DirectorConciergePill';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-slate-950 relative">
      {/* Global Top Navigation */}
      <Navbar />

      {/* Main Wedding Studio Experience */}
      <main>
        {/* 1. Cinematic Hero with Rotating Visuals & VIP Event Code Access */}
        <HeroSection />

        {/* 2. Interactive Director Schedule & Date Availability Checker */}
        <DateAvailabilityChecker />

        {/* 3. Featured 4K Wedding Cinema Teasers with Video Player */}
        <FeaturedFilmsSection />

        {/* 4. Curated Wedding Photography Portfolio & Lightbox */}
        <PortfolioSection />

        {/* 5. Interactive Cinema Color Grading (S-Log3 vs Master Grade) */}
        <ColorGradeSliderSection />

        {/* 6. Owner / Director Spotlight & Studio Philosophy */}
        <DirectorStorySection />

        {/* 7. Comprehensive Wedding Photography & Cinema Services */}
        <ServicesSection />

        {/* 8. Studio Collections & Interactive Package Estimator */}
        <PackagesSection />

        {/* 9. Instant AI Face-Recognition Guest Experience Demo */}
        <AiSearchPreviewSection />

        {/* 10. Real Bride & Groom Testimonials & Google Ratings */}
        <TestimonialsSection />

        {/* 11. Multi-Step Date Reservation & CRM Lead Capture */}
        <InquiryFormSection />
      </main>

      {/* Floating Director Concierge Pill */}
      <DirectorConciergePill />

      {/* Global Studio Footer */}
      <Footer />
    </div>
  );
}
