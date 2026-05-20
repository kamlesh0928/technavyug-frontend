import Hero from "@/components/home/Hero";
import TechStack from "@/components/home/TechStack";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Comparison from "@/components/home/Comparison";
import Roadmap from "@/components/home/Roadmap";
import LaunchCTA from "@/components/home/LaunchCTA";
import Faq from "@/components/home/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <TechStack />
      <FeaturedCourses />
      <FeaturedProducts />
      <Comparison />
      <Roadmap />
      <LaunchCTA />
      <Faq />
    </>
  );
}
