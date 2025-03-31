import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import FreeShippingBanner from "../components/FreeShippingBanner";

export default function DefaultLayout() {
  return (
    <>
      <FreeShippingBanner />
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
