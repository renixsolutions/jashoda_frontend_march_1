import Hero from "@/components/home/Hero";
import BenefitsStrip from "@/components/home/BenefitsStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import TrendingCarousel from "@/components/home/TrendingCarousel";
import PromoCarousel from "@/components/home/PromoCarousel";
import NewArrivals from "@/components/home/NewArrivals";
import ImageShowcase from "@/components/home/ImageShowcase";
import LuxuryShowcase from "@/components/home/LuxuryShowcase";
import VideoStories from "@/components/home/VideoStories";
import HomeVideo from "@/components/home/HomeVideo";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      {/* <HomeVideo /> */}
      <section className="mt-16">
        <Hero />
      </section>
      <BenefitsStrip />
      <PromoCarousel />
      <LuxuryShowcase />
      <ImageShowcase />
      <NewArrivals />
      <CategoryGrid />
      <TrendingCarousel />
      <VideoStories />
      <Testimonials />
    </main>
  );
}
