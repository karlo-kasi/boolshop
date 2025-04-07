import Hero from "../components/Hero";
import NewProductsList from "../components/NewProductsList";
import BestsellersList from "../components/BestsellersList";
import PopupComponent from "../components/PopUp";

export default function HomePage() {
  return (
    <>
      <PopupComponent />
      <Hero />
      <NewProductsList />
      <BestsellersList />
    </>
  );
}
