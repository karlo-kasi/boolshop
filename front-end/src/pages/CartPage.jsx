import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//ICON
import { TiDelete } from "react-icons/ti";

//COMPONENTS
import QuantityCounter from "../components/QuantityCounter";
import OrderSummary from "../components/OrderSummary"; // Importa OrderSummary

export default function CartPage() {
  // Stato per memorizzare gli elementi nel carrello (esempio)
  const [cartItems, setCartItems] = useState(() => {
    // Inizializza da localStorage o da un array vuoto
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  useEffect(() => {
    // Salva gli elementi del carrello nel localStorage ogni volta che cambiano
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Funzione per rimuovere un elemento dal carrello
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  // Funzione per calcolare il totale del carrello
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const [amountLeftForFreeShipping, setAmountLeftForFreeShipping] = useState(
    (29.99 - calculateTotal()).toFixed(2)
  );

  useEffect(() => {
    setAmountLeftForFreeShipping((29.99 - calculateTotal()).toFixed(2));
  }, [cartItems, calculateTotal]);

  const shippingCost = calculateTotal() > 29.99 ? 0 : 13;

  const totalWithShipping = calculateTotal() + shippingCost;

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="container mb-5 mx-0">
      <h1 className="text-center mt-3">Il tuo carrello</h1>
      <div className="row ">
        <div className="col-md-8">
          <div className="bg-light p-3 mb-4">
            <div className="">
              <h5 className="mb-3">Prodotti nel tuo carrello</h5>
              {cartItems.length === 0 ? (
                <p className="mb-3">Il tuo carrello è vuoto.</p>
              ) : (
                <div className=" d-flex flex-column gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="container">
                      <div className="row justify-content-between align-items-center gap-2">
                        <div className="col-md-3">
                          <img
                            src={item.image}
                            className="img-fluid float-start rounded w-100"
                            alt={item.name}
                          />
                        </div>
                        <div className="col-md-8 d-flex flex-column justify-content-between">
                          <div className="">
                            <h5 className="">{item.name}</h5>
                            <p className="">Prezzo: {item.price}€</p>
                            <p className="">Quantità: {item.quantity}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <QuantityCounter
                                onQuantityChange={(quantity) => {
                                  const updatedItems = cartItems.map(
                                    (cartItem) =>
                                      cartItem.id === item.id
                                        ? { ...cartItem, quantity }
                                        : cartItem
                                  );
                                  setCartItems(updatedItems);
                                }}
                              />
                              <button
                                className="btn btn-trasparent border-0 "
                                onClick={() => removeFromCart(item.id)}
                              >
                                Rimuovi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <OrderSummary
          calculateTotal={calculateTotal}
          shippingCost={shippingCost}
          totalWithShipping={totalWithShipping}
          formatPrice={formatPrice}
          isCartEmpty={isCartEmpty}
        />
      </div>
    </div>
  );
}
