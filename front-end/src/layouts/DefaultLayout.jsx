import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import FreeShippingBanner from "../components/FreeShippingBanner";
import Hero from "../components/Hero";

export default function DefaultLayout() {
  return (
    <>
      <FreeShippingBanner />
      <Header />
      <Hero />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
