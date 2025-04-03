import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";

//ICON
import { TiDelete } from "react-icons/ti";

//COMPONENTS
import QuantityCounter from "../components/QuantityCounter";
import OrderSummary from "../components/OrderSummary"; // Importa OrderSummary

export default function CartPage() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    const parsedItems = storedCartItems ? JSON.parse(storedCartItems) : [];
    console.log("Cart Items:", parsedItems); // Verifica che slug sia presente
    return parsedItems;
  });

  // Calcola i valori una volta sola per render
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 29.99 ? 0 : 13;
  const total = subtotal + shippingCost;

  // Funzione stabile per aggiornare la quantità
  const handleQuantityUpdate = useCallback((itemId, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  }, []);

  // Funzione stabile per rimuovere dal carrello
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  }, []);

  const formatPrice = (price) => Number(price).toFixed(2);

  return (
    <div className="container mb-5 mx-0">
      <h1 className="text-center mt-3">Il tuo carrello</h1>
      <div className="row">
        <div className="col-md-8">
          <div className="bg-light p-3 mb-4">
            <h5 className="mb-3">Prodotti nel tuo carrello</h5>
            {cartItems.length === 0 ? (
              <p className="mb-3">Il tuo carrello è vuoto.</p>
            ) : (
              <div className="d-flex flex-column gap-4">
                {cartItems.map(
                  (item) => (
                    console.log(item),
                    (
                      <div className="container">
                        <div className="row justify-content-between align-items-center gap-2">
                          <Link
                            to={`/cover/${item.slug}`}
                            key={item.id}
                            className="text-decoration-none col-md-3"
                          >
                            <img
                              src={item.image}
                              className="img-fluid float-start rounded w-100"
                              alt={item.name}
                            />
                          </Link>
                          <div className="col-md-8 d-flex flex-column justify-content-between text-black">
                            <div className="">
                              <h5 className="">{item.name}</h5>
                              <p className="">Prezzo: {item.price}€</p>
                              <p className="">Quantità: {item.quantity}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <QuantityCounter
                                  initialValue={item.quantity}
                                  onQuantityChange={(newQuantity) =>
                                    handleQuantityUpdate(item.id, newQuantity)
                                  }
                                />
                                <button
                                  className="btn btn-transparent border-0"
                                  onClick={(e) => {
                                    e.preventDefault(); // Previene il redirect quando si clicca su "Rimuovi"
                                    removeFromCart(item.id);
                                  }}
                                >
                                  Rimuovi
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            )}
          </div>
        </div>
        <OrderSummary
          calculateTotal={() => subtotal}
          shippingCost={shippingCost}
          totalWithShipping={total}
          formatPrice={formatPrice}
          isCartEmpty={cartItems.length === 0}
        />
      </div>
    </div>
  );
}
