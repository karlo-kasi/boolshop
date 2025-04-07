import Checkout from "../components/Checkout";
import { useEffect } from "react";

export default function CheckoutPage() {
  const handlePaymentSuccess = () => {
    // Svuota il carrello dal localStorage
    localStorage.removeItem("cartItems");
    // Notifica altre parti dell'app che il carrello è stato svuotato
    window.dispatchEvent(new Event("storage"));
  };

  return <Checkout onPaymentSuccess={handlePaymentSuccess} />;
}
