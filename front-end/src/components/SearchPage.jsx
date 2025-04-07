import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Stato per il nuovo input di ricerca
  const [filter, setFilter] = useState(""); // Stato per il filtro
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name") || "";
  const description = queryParams.get("description") || "";
  const initialFilter = queryParams.get("filter") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cover/search", {
          params: {
            name,
            description,
            filter: initialFilter,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Errore durante il recupero dei prodotti:", error);
      }
    };

    fetchProducts();
  }, [name, description, initialFilter]);

  const handleSearch = () => {
    navigate(
      `/search?name=${searchTerm}&description=${searchTerm}&filter=${filter}`
    );
  };

  return (
    <div className="container mt-4">
      <h2>Risultati per: "{name}"</h2>

      {/* Campo di ricerca */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Cerca altri prodotti..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-control"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Ordina per...</option>
          <option value="price_asc">Prezzo crescente</option>
          <option value="price_desc">Prezzo decrescente</option>
          <option value="name_asc">A-Z</option>
          <option value="name_desc">Z-A</option>
          <option value="recent">Recenti</option>
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>
          Cerca
        </button>
      </div>

      {/* Lista prodotti */}
      <div className="row g-3 mb-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-md-4 d-flex">
              <ProductCard product={product} className="flex-grow-3" />
            </div>
          ))
        ) : (
          <p>Nessun prodotto trovato.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
