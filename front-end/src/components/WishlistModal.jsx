import React, { useCallback, useEffect, useRef } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useModal } from "../context/ModalContext";
import PressAndHoldButton from "./PressAndHoldButton"; // Importa il nuovo componente
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa"; // Importa l'icona
import { useCart } from "../context/CartContext";

export default function WishlistModal({ show, onClose }) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { openModal } = useModal();
  const modalRef = useRef(null);
  const { addToCart: addToCartContext } = useCart();

  const initScroll = window.scrollTo(0, 0);

  const addToCart = useCallback(
    (item) => {
      addToCartContext(item);
      onClose();
      openModal();
    },
    [addToCartContext, onClose, openModal]
  );

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={`wishlist-modal ${show ? "show" : ""}`}>
      <div className="wishlist-modal-dialog" ref={modalRef}>
        <div className="wishlist-modal-header d-flex justify-content-around align-items-center">
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
                    <Link
                      to={`/cover/${item.slug}`}
                      onClick={{ onClose, initScroll }} //PER FARLA SCROLLARE IN ALTOA INIZIO PAGINA
                    >
                      <img
                        src={item.image}
                        className="wishlist-item-image"
                        alt={item.name}
                      />
                    </Link>
                    <div className="wishlist-item-details">
                      <Link
                        to={`/cover/${item.slug}`}
                        className="text-decoration-none text-dark"
                        onClick={{ onClose, initScroll }}
                      >
                        <h5>{item.name}</h5>
                      </Link>
                      <p>Prezzo: {item.price}€</p>
                      <div className="d-flex gap-4 justify-content-center">
                        <div>
                        <button
                          className="btn-wishlist press-hold-btn "
                          onClick={() => addToCart(item)}
                        >
                          Aggiungi al carrello
                        </button>
                        <span></span>
                        </div>

                        <div className="d-flex flex-column align-items-center">
                        <PressAndHoldButton
                          className="btn-wishlist btn-wishlist-red"
                          onHoldComplete={() => removeFromWishlist(item.id)}
                        >
                          Rimuovi dai preferiti
                        </PressAndHoldButton>
                        <span class="pressSub text-center d-block">tieni premuto per rimuovere </span>

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
  );
}
