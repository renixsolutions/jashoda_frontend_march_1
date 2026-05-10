import PremiumHero from "@/components/premium/PremiumHero";
import TextMarquee from "@/components/premium/TextMarquee";
import VideoSlideshow from "@/components/premium/VideoSlideshow";
import ServiceMarquee from "@/components/premium/ServiceMarquee";
import BentoShowcase from "@/components/premium/BentoShowcase";
import PromoBanner from "@/components/premium/PromoBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import PromoCarousel from "@/components/home/PromoCarousel";
import HomeVideo from "@/components/home/HomeVideo";
import Testimonials from "@/components/home/Testimonials";
import VideoStories from "@/components/home/VideoStories";
import DynamicCollections from "@/components/home/DynamicCollections";


export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      <HomeVideo />
      <TextMarquee />
      <PremiumHero />

      <CategoryGrid />
      <VideoSlideshow />
      <ServiceMarquee />
      <PromoCarousel />
      <DynamicCollections />
      <BentoShowcase />
      <PromoBanner />
      <VideoStories />
      <Testimonials />
    </main>
  );
}
