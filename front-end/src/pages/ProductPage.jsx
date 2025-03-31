import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import divieto from "../assets/img/1.avif";
import imballaggio from "../assets/img/2.avif";
import riciclo from "../assets/img/3.avif";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Product ID:", slug);
    axios
      .get(`http://localhost:3000/cover/${slug}`)

      .then((response) => {
        if (response.data) {
          setProduct(response.data);
        } else {
          setError("Prodotto non trovato");
        }
      })
      .catch((error) => {
        setError("Errore nel recupero del prodotto");
        console.error(error);
      });
  }, [slug]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Caricamento...</div>;
  }

  return (
    <>
      <div className="row" key={product.id}>
        <div className="card text-decoration-none col">
          <img
            src={product.image}
            className="card-img-top"
            alt={product.name}
          />
    </div>
        <div className="text-decoration-none col">
     
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">${product.price}</p>
          </div>
        </div>
      </div>
      <div class="accordion mt-5" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Descrizione Prodotto
            </button>
          </h2>
          <div
            id="collapseTwo"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">{product.description}</div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Safety and Regulations
            </button>
          </h2>
          <div
            id="collapseThree"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div className="text-center">
                <img src={divieto} alt="" width={50} />
                <p>
                  Il prodotto non deve essere utilizzato da bambini o da persone
                  non in grado di comprendere l’eventuale pericolosità.
                </p>
              </div>
              <div className="text-center">
                <img src={imballaggio} alt="" width={50} />

                <p>
                  Imballaggio dell'articolo soggetto al sistema di riciclaggio
                  "Green Dot"
                </p>
              </div>
              <div className="text-center">
                <img src={riciclo} alt="" width={50} />
                <p>L'imballaggio dell'articolo è riciclabile </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
