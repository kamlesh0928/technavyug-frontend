import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import Stats from "../../components/home/TechStack";
import FeaturedCourses from "../../components/home/FeaturedCourses";
import WhyUs from "../../components/home/WhyUs";
import CTA from "../../components/home/LaunchCTA";
import Footer from "../../components/layout/Footer";
import TrustedCompanies from "../../components/home/Comparison";
import Testimonials from "../../components/home/Roadmap";

export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <Stats />
    <FeaturedCourses />
    <TrustedCompanies />
    <WhyUs />
    <Testimonials />
    <CTA />
    <Footer />
  </>
  );
}