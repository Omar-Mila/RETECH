import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import PhonesSection from "../components/PhoneSection";
import WhyReTech from "../components/WhyReTech";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div className="mx-auto">
      <Navbar />
      <Carousel />
      <PhonesSection />
      <WhyReTech />
      <FAQSection />
      <Footer />
    </div>
  )
}
