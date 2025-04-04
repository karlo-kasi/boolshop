import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useModal } from "../context/ModalContext";

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

  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  useEffect(() => {
    if (modalData) {
      setCartItems(modalData.cartItems || []); // Aggiorna i dati del carrello dalla modale
    }
  }, [modalData]);

  useEffect(() => {
    // Salva gli elementi del carrello nel localStorage ogni volta che cambiano
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Cart Items Updated:", cartItems); // Log per il debug
  }, [cartItems]);

  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      // Aggiorna la quantità se il prodotto esiste già
      const updatedItems = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
            <div className="d-flex gap-3">
              <NavLink onClick={handleSearchClick}><FaSearch className="fs-3 text-black" /></NavLink>
              <NavLink><FaRegHeart className="fs-3 text-black" /></NavLink>
              <NavLink onClick={() => openModal()}>
                <FiShoppingCart className="fs-3 text-black" />
              </NavLink>
            </div>
          </div>
        </nav>
      </header>

      {showSearchModal && (
        <div className="modal d-block" tabIndex="-1">
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
                  className="btn btn-primary"
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
                          <div>
                            <h5>{item.name}</h5>
                            <p>Prezzo: {item.price}€</p>
                            <p>Quantità: {item.quantity}</p>
                            <button
                              className="btn btn-transparent border-0"
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
              <Link to="/cart" >
                <button type="button" className="btn-modal" onClick={closeModal}>
                  Vai al carrello
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
