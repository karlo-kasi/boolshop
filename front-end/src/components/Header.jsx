import React, { useState, useEffect } from "react"; // Aggiunto useEffect
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, NavLink } from "react-router-dom";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { TiDelete } from "react-icons/ti"; // Aggiunto TiDelete
import QuantityCounter from "./QuantityCounter"; // Aggiunto import di QuantityCounter

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCartClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [cartItems, setCartItems] = useState(() => {
    // Inizializza da localStorage o da un array vuoto
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  useEffect(() => {
    // Salva gli elementi del carrello nel localStorage ogni volta che cambiano
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Cart Items Updated:", cartItems); // Log per il debug
  }, [cartItems]);

  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      // Aggiorna la quantità se il prodotto esiste già
      const updatedItems = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedItems);
    } else {
      // Aggiungi un nuovo prodotto
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    console.log("Product added to cart:", product); // Log per il debug
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
            <div className="d-flex gap-2">
              <NavLink><FaSearch className="fs-3 text-black" /></NavLink>
              <NavLink><FaRegHeart className="fs-3 text-black" /></NavLink>
              <NavLink onClick={handleCartClick}>
                <FiShoppingCart className="fs-3 text-black" />
              </NavLink>
            </div>
          </div>
        </nav>
      </header>

      {/* Modale */}
      {isModalOpen && (
        <div className="custom-modal">
          <div className="custom-modal-dialog">
              <div className="custom-modal-header">
                <h5 className="modal-title">Carrello</h5>
                <button type="button" className="btn-close text-white" onClick={handleCloseModal}></button>
              </div>
              <div className="custom-modal-body">
              {cartItems.length === 0 ? (
                <p className="mb-3">Il tuo carrello è vuoto.</p>
              ) : (
                <div className=" d-flex flex-column gap-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="container"
                      style={{ maxWidth: "540px" }}
                    >
                      <div className="row justify-content-between align-items-center gap-2">
                        <div className="col-md-3">
                          <img
                            src={item.image}
                            className="img-fluid rounded w-100"
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
                              <TiDelete
                                className="fs-5"
                                size={30}
                                onClick={() => removeFromCart(item.id)}
                              />
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
                <button type="button" onClick={handleCloseModal}>
                  Vai al carrello
                </button>
              </div>
          </div>
        </div>
      )}
    </>
  );
}
