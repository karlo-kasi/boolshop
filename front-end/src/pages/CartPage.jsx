import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";

//ICON
import { TiDelete } from "react-icons/ti";
import { FaRegTrashAlt } from "react-icons/fa"; // Importa l'icona

//COMPONENTS
import QuantityCounter from "../components/QuantityCounter";
import OrderSummary from "../components/OrderSummary"; // Importa OrderSummary
import { useCart } from "../context/CartContext";
import PressAndHoldButton from "../components/PressAndHoldButton.jsx";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart: removeFromCartContext,
    setCartItems,
    updateQuantity,
  } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedCartItems = localStorage.getItem("cartItems");
      setCartItems(storedCartItems ? JSON.parse(storedCartItems) : []);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setCartItems]);

  // Calcola i valori una volta sola per render
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 29.99 ? 0 : 13;
  const total = subtotal + shippingCost;

  // Funzione stabile per aggiornare la quantità
  const handleQuantityUpdate = useCallback(
    (itemId, newQuantity) => {
      updateQuantity(itemId, newQuantity);
    },
    [updateQuantity]
  );

  // Funzione stabile per rimuovere dal carrello
  const removeFromCart = useCallback(
    (productId) => {
      removeFromCartContext(productId);
    },
    [removeFromCartContext]
  );

  const handleRemoveClick = (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      setItemToDelete(null);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

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
                                >
                                  {item.quantity <= 1 && (
                                    <FaRegTrashAlt
                                      className="trash"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        removeFromCart(item.id);
                                      }}
                                    />
                                  )}
                                </QuantityCounter>
                                <button
                                  className="btn btn-transparent border-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveClick(item);
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

      {/* Modal di conferma */}
      <div
        className={`modal ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
        }}
      >
        <div
          className="modal-dialog"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: 0,
            minWidth: "300px",
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Conferma rimozione</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              Sei sicuro di voler rimuovere questo prodotto dal carrello?
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="press-hold-btn"
                onClick={handleClose}
              >
                Annulla
              </button>
              <PressAndHoldButton
                type="button"
                className="btn btn-danger"
                onHoldComplete={confirmDelete}
              >
                Rimuovi
              </PressAndHoldButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
