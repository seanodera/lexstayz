import Image from "next/image";
import Banner from "@/components/home/banner";
import Destination from "@/components/home/destination";
import SearchComponent from "@/components/home/searchComponent";
import {getFeePercentage} from "@/lib/utils";

export default function Home() {
  return (
    <div className={'bg-white'}>
      <Banner/>
      {getFeePercentage(50)}
        <div className={'xl:hidden'}>
          <SearchComponent/>
        </div>
        <Destination/>
    </div>
  );
}
