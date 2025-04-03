import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

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
              <NavLink><FaSearch className="fs-3 text-black" /></NavLink>
              <NavLink><FaRegHeart className="fs-3 text-black" /></NavLink>
              <NavLink onClick={handleCartClick}>

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
    </>
  );
}
