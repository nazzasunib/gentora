import Hero from "@/components/home/Hero";
import BrandIntro from "@/components/home/BrandIntro";
import Categories from "@/components/home/Categories";
import NewArrivals from "@/components/home/NewArrivals";
import Showcase3D from "@/components/home/Showcase3D";
import OfficeLook from "@/components/home/OfficeLook";
import BestSellers from "@/components/home/BestSellers";
import BrandValues from "@/components/home/BrandValues";
import Offers from "@/components/home/Offers";
import Reviews from "@/components/home/Reviews";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <Categories />
      <NewArrivals />
      <Showcase3D />
      <OfficeLook />
      <BestSellers />
      <BrandValues />
      <Offers />
      <Reviews />
      <Newsletter />
    </>
  );
}
