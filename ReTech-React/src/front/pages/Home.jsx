import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import SeccionMoviles from "../components/PhoneSection";
import WhyReTech from "../components/WhyReTech";
import PhoneJourney from "../components/PhoneJourney";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="mx-auto">
      <Navbar />
      <Carousel />
      <SeccionMoviles />
      <PhoneJourney />
      <WhyReTech />
      <FAQSection />
      <Footer />
    </div>
  )
}
