
import Hero from "../components/Hero";

import ProductCard from "../components/ProductCard";
import NewProductsList from "../components/NewProductsList";
import BestsellersList from "../components/BestsellersList";


export default function HomePage() {
  return (
    <>      
      <Hero />
      <NewProductsList />
      <BestsellersList />
    </>
  );
}


