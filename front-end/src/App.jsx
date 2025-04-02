import DefaultLayout from "./layouts/DefaultLayout";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage"; // Importa CartPage

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={DefaultLayout}>
            <Route path="/" Component={HomePage} />
            <Route path="/cover/:slug" Component={ProductPage} />
            <Route path="/checkout" Component={CheckoutPage} />
            <Route path="/cart" Component={CartPage} />{" "}
            {/* Aggiungi la route per CartPage */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
