import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import SeccionMoviles from "../components/PhoneSection";
import WhyReTech from "../components/WhyReTech";
import PhoneJourney from "../components/PhoneJourney";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="hm-page">
      <Navbar />
      <Carousel />
      <SeccionMoviles />
      <PhoneJourney />
      <WhyReTech />
      <FAQSection />
      <Footer />

      <style>{`
        .hm-page {
          width: 100%;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
