import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import PhonesSection from "../components/PhoneSection";
export default function Home() {
  return (
    <div className="w-[80%] mx-auto">
      <Navbar />
      <Carousel />
      <PhonesSection />

    </div>
  )
}
