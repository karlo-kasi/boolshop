import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const description = queryParams.get("description");
  const filter = queryParams.get("filter");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cover/search`, {
          params: {
            name: name || "",
            description: description || "",
            filter: filter || "",
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Errore durante il recupero dei prodotti:", error);
      }
    };

    fetchProducts();
  }, [name, description, filter]);

  return (
    <div className="container mt-4">
      <h2>Risultati per: "{name}"</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            /*<div className="col-4" key={product.id}>
              <div className="card">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">€{product.price}</p>
                </div>
              </div>
            </div>*/
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Nessun prodotto trovato.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
