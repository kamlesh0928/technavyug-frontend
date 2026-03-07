import MainLayout from "../layout/MainLayout";
import Hero from "../components/home/Hero";
import FeaturedCourses from "../components/home/FeaturedCourses";

function Home() {
  return (
    <MainLayout>
      <Hero />
      <FeaturedCourses />
    </MainLayout>
  );
}

export default Home;