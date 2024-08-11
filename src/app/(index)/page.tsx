import Image from "next/image";
import Banner from "@/components/home/banner";
import Destination from "@/components/home/destination";
import SearchComponent from "@/components/home/searchComponent";
import Footer from "@/components/navigation/Footer";

export default function Home() {
  return (
    <div className={'bg-white'}>
      <Banner/>
        <div className={'xl:hidden'}>
          <SearchComponent/>
        </div>
        <Destination/>
      <Footer/>
    </div>
  );
}
