import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default MainLayout;