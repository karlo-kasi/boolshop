import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import FreeShippingBanner from "../components/FreeShippingBanner";
import Hero from "../components/hero";

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <FreeShippingBanner />
      <Hero />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
