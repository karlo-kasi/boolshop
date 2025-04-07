import DefaultLayout from "./layouts/DefaultLayout";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchPage from "./components/SearchPage";
import { ModalProvider } from "./context/ModalContext"; // Import del provider
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_51R9uT2H9dC3WZ03zWtzI5XQwoJe1l9CCDTKXtvYgdg07iYu6iJuXil0nS7QoCdypHYcicfjtyAPnckYRw30LIhhw007BI7p4JZ");
import { WishlistProvider } from "./context/WishlistContext";


function App() {
  return (
    <>
      <BrowserRouter>
        <ModalProvider>
          <WishlistProvider>
            <Routes>
              <Route Component={DefaultLayout}>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/" Component={HomePage} />
                <Route path="/cover/:slug" Component={ProductPage} />
                <Route
                  path="/checkout" element={
                    <Elements stripe={stripePromise}>
                      <CheckoutPage />
                    </Elements>
                  }
                />
                <Route path="/cart" Component={CartPage} />
                <Route path="/thank-you" Component={ThankYouPage} />
                <Route path="*" Component={NotFoundPage} />
              </Route>
            </Routes>
          </WishlistProvider >
        </ModalProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
