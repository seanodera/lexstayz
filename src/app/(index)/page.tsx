import Image from "next/image";
import Banner from "@/components/home/banner";
import Destination from "@/components/home/destination";

export default function Home() {
  return (
    <div className={'bg-white'}>
      <Banner/>
        <Destination/>
    </div>
  );
}
