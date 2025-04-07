import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useModal } from "../context/ModalContext";
import { useWishlist } from "../context/WishlistContext";
import WishlistModal from "./WishlistModal";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const navigate = useNavigate(); // Usato per navigare alla pagina dei risultati di ricerca

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handleCloseModal = () => {
    setShowSearchModal(false);
  };

  const handleSearch = async () => {
    try {
      // Chiudi la modale prima di navigare
      setShowSearchModal(false);

      // Naviga verso la SearchPage con il termine di ricerca e il filtro come query string
      navigate(
        `/search?name=${searchTerm}&description=${searchTerm}&filter=${filter}`
      );
    } catch (error) {
      console.error("Errore durante la ricerca:", error);
    }
  };

  const { isModalOpen, modalData, closeModal, openModal } = useModal(); // Usa modalData dal contesto
  const {
    cartItems,
    setCartItems: setCartItemsContext,
    removeFromCart: removeFromCartContext,
  } = useCart();

  const removeFromCart = (id) => {
    removeFromCartContext(id);
  };

  const { wishlist } = useWishlist();
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  const handleCartClick = () => {
    setShowWishlistModal(false); // Chiudi la modale Wishlist
    openModal(); // Apri la modale Carrello
  };

  const handleWishlistClick = () => {
    setShowWishlistModal(true); // Imposta lo stato per aprire la modale Wishlist
  };

  return (
    <>
      <header className="position-sticky top-0 z-3">
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <Link className="navbar-brand" to={"/"}>
                <img
                  className="logo"
                  src="../public/boolshop-logo.svg"
                  alt="boolshop"
                />
              </Link>
            </div>

            <div className="d-none d-lg-flex">
              <Link to="/">
                <button className="btn btn-outline-dark m-1">Home</button>
              </Link>
              <button className="btn btn-outline-dark m-1">About Us</button>
              <button className="btn btn-outline-dark m-1">Products</button>
              <button className="btn btn-outline-dark m-1">Contact</button>
            </div>

            <div className="d-flex gap-3">
              <NavLink onClick={handleSearchClick}>
                <FaSearch className="fs-3 text-black" />
              </NavLink>
              <NavLink onClick={handleWishlistClick}>
                <FaHeart className="fs-3 text-black" />
              </NavLink>
              <NavLink
                onClick={() => openModal()}
                className="position-relative"
              >
                <FiShoppingCart className="fs-3 text-black" />
                {cartItems.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </nav>
      </header>

      {/* MODALE PER LA RICERCA */}
      {showSearchModal && (
        <div className="modal searchModal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cerca prodotti</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cerca nome o descrizione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="form-control mt-2"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">Ordina per...</option>
                  <option value="price_asc">Prezzo crescente</option>
                  <option value="price_desc">Prezzo decrescente</option>
                  <option value="name_asc">Nome crescente</option>
                  <option value="name_desc">Nome decrescente</option>
                  <option value="recent">Recenti</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="custom-btnCarmelo"
                  onClick={handleSearch} // Naviga alla SearchPage
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="custom-modal">
          <div className="custom-modal-dialog">
            <div className="custom-modal-header">
              <p className="title-modal">Carrello</p>
              <button
                type="button"
                className="btn-close text-dark bold"
                onClick={closeModal}
              ></button>
            </div>
            <div className="custom-modal-body">
              {cartItems.length === 0 ? (
                <p className="mb-3">Il tuo carrello è vuoto.</p>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="container">
                      <div className="row justify-content-between align-items-center gap-2">
                        <div className="col-md-3">
                          <Link to={`/cover/${item.slug}`}>
                            <img
                              src={item.image}
                              className="img-fluid rounded w-100"
                              alt={item.name}
                            />
                          </Link>
                        </div>
                        <div className="col-md-8 d-flex flex-column justify-content-between">
                          <div>
                            <Link
                              to={`/cover/${item.slug}`}
                              className="text-decoration-none text-dark"
                            >
                              <h5>{item.name}</h5>
                            </Link>
                            <p>Prezzo: {item.price}€</p>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                  const updatedItems = cartItems.map(
                                    (cartItem) =>
                                      cartItem.id === item.id &&
                                      cartItem.quantity > 1
                                        ? {
                                            ...cartItem,
                                            quantity: cartItem.quantity - 1,
                                          }
                                        : cartItem
                                  );
                                  setCartItemsContext(updatedItems);
                                }}
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                  const updatedItems = cartItems.map(
                                    (cartItem) =>
                                      cartItem.id === item.id
                                        ? {
                                            ...cartItem,
                                            quantity: cartItem.quantity + 1,
                                          }
                                        : cartItem
                                  );
                                  setCartItemsContext(updatedItems);
                                }}
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="btn btn-transparent border-0 mt-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Rimuovi
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="custom-modal-footer">
              <Link to="/cart">
                <button
                  type="button"
                  className="custom-btnCarmelo"
                  onClick={closeModal}
                >
                  Vai al carrello
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <WishlistModal
        show={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        addToCart={(product) => {
          const existingItem = wishlist.find((item) => item.id === product.id);
          if (existingItem) {
            // Aggiorna la quantità se il prodotto esiste già
            const updatedItems = wishlist.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            setWishlist(updatedItems);
          }
        }}
      />
    </>
  );
}
