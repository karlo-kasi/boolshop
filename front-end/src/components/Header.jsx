import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaRegHeart, FaRegTrashAlt } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useModal } from "../context/ModalContext";
import { useWishlist } from "../context/WishlistContext";
import WishlistModal from "./WishlistModal";
import { useCart } from "../context/CartContext";
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const navigate = useNavigate(); // Usato per navigare alla pagina dei risultati di ricerca
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const { isModalOpen, modalData, closeModal, openModal } = useModal();

  // Usa modalData dal contesto

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
          <div className="container d-flex flex-wrap justify-content-between align-items-center px-6">
            <div className="d-flex align-items-center">
              {/* Mobile Hamburger Icon */}
              <div className="d-flex d-lg-none ms-auto">
                <button
                  className="btn"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
              <Link className="navbar-brand d-none d-lg-flex" to={"/"}>
                <img
                  className="logo"
                  src="../public/boolshop-logo.svg"
                  alt="boolshop"
                />
              </Link>
              <NavLink className={"d-block d-lg-none"} to={"/search"}>
                <FaSearch className="fs-3 text-black" />
              </NavLink>
            </div>

            <div className="d-none d-lg-flex gap-3">
              <Link to="/">
                <button className="btn fw-bold fs-5">Home</button>
              </Link>
              <Link to="/search">
                <button className="btn fw-bold fs-5">Prodotti</button>
              </Link>
              <Link to="/about">
                <button className="btn fw-bold fs-5">Chi Siamo</button>
              </Link>
            </div>

            <Link className="navbar-brand d-flex d-lg-none" to={"/"}>
              <img
                className="logo"
                src="../public/boolshop-logo.svg"
                alt="boolshop"
              />
            </Link>




            {/* Mobile Menu */}
            <div
              className={`position-absolute top-100 start-0 w-100 bg-white shadow-sm d-lg-none p-3 z-3 mobile-menu ${isMobileMenuOpen ? "slide-down" : "slide-up"
                }`}
            >
              <Link
                to="/"
                className="d-block mt-2 mb-3 text-decoration-none text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="d-block mb-3 text-decoration-none text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Prodotti
              </Link>
              <Link
                to="/about"
                className="d-block text-decoration-none text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chi Siamo
              </Link>
            </div>

            <div className="d-flex gap-3">
              <NavLink className={"d-none d-lg-block"} to={"/search"}>
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
      {/* MODALE CARRELLO */}
      {isModalOpen && (
        <div className="custom-modal">
          <div className="custom-modal-dialog">
            <div className="custom-modal-header d-flex justify-content-between align-items-center">
              <p className="title-modal fs-3">Carrello</p>
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
                          <Link onClick={closeModal} to={`/cover/${item.slug}`}>
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
                              onClick={closeModal}
                              to={`/cover/${item.slug}`}
                              className="text-decoration-none text-dark"
                            >
                              <h5>{item.name}</h5>
                            </Link>
                            <p>Prezzo: {item.price}€</p>
                            <div className="d-flex align-items-center gap-2">
                              {item.quantity <= 1 ? (
                                <FaRegTrashAlt
                                  className="trash"
                                  onClick={() => removeFromCart(item.id)}
                                />
                              ) : (
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
                              )}
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
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="custom-modal-footer">
              <Link to="/cart">
                <button
                  type="button"
                  className="btn btn-primary fs-5"
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
      />
    </>
  );
}
