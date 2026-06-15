import HomeCta from "../../components/home/HomeCta";
import HomeDestinations from "../../components/home/HomeDestinations";
import HomeHubs from "../../components/home/HomeHubs";
import HomeFeatures from "../../components/home/HomeFeatures";
import HomeHero from "../../components/home/HomeHero";
import HomePartners from "../../components/home/HomePartners";
import HomeTestimonial from "../../components/home/HomeTestimonial";
import HomeUpcomingTours from "../../components/home/HomeUpcomingTours";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomePartners />
      <HomeHubs />
      <HomeUpcomingTours />
      <HomeFeatures />
      <HomeDestinations />
      <HomeTestimonial />
      <HomeCta />
    </>
  );
}
