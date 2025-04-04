import React, { useCallback } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useModal } from "../context/ModalContext";

export default function WishlistModal({ show, onClose }) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { openModal } = useModal(); // Usa openModal per aprire il carrello

  const addToCart = useCallback(
    (item) => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItem = cartItems.find(
        (cartItem) => cartItem.id === item.id
      );
      const updatedCart = existingItem
        ? cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        : [...cartItems, { ...item, quantity: 1 }];
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));

      // Chiudi la wishlist e apri il carrello con i dati aggiornati
      onClose();
      openModal({ cartItems: updatedCart });
    },
    [onClose, openModal]
  );

  if (!show) return null;

  return (
    <div className="wishlist-modal">
      <div className="wishlist-modal-dialog">
        <div className="wishlist-modal-header">
          <p className="title-modal">Preferiti</p>
          <button
            type="button"
            className="btn-close text-dark bold"
            onClick={onClose}
          ></button>
        </div>
        <div className="wishlist-modal-body">
          {wishlist.length === 0 ? (
            <p className="mb-3">La tua wishlist è vuota.</p>
          ) : (
            <div className="d-flex flex-column gap-4">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      className="wishlist-item-image"
                      alt={item.name}
                    />
                    <div className="wishlist-item-details">
                      <h5>{item.name}</h5>
                      <p>Prezzo: {item.price}€</p>
                      <div className="d-flex gap-4 justify-content-center">
                        <button
                          className="btn-wishlist"
                          onClick={() => addToCart(item)}
                        >
                          Aggiungi al carrello
                        </button>
                        <button
                          className="btn-wishlist"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          Rimuovi dai preferiti
                        </button>
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
  );
}
