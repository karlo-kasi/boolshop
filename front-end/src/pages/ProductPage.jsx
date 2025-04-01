import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//COMPONENTS
import QuantityCounter from "../components/QuantityCounter";
import BestsellersList from "../components/BestsellersList";

//ICONS
import { FaRegHeart } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";

//IMAGES ACCORDION
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
      {/* ROW SINGLE CARD */}
      <div className="row m-5" key={product.id}>
        <div className="card text-decoration-none col-sm-12 col-md-7">
          <img
            src={product.image}
            className="card-img-top"
            alt={product.name}
          />
        </div>
        <div className="text-decoration-none col-sm-12 col-md-5 d-flex flex-column gap-4 p-4">
          <div className="">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.price}&euro;</p>
          </div>

          <div className="d-flex justify-content-around align-items-center">
            <QuantityCounter />
            <FaRegHeart size={25} />
          </div>
          <button className="btn btn-outline-secondary">
            Aggiungi al carrello
          </button>
          <div className=" d-flex flex-column gap-2">
            <FiPackage size={25} />
            <span className="card-text">
              <strong>Ordina ora</strong> e ricevi in 1-2 giorni lavorativi
            </span>
            <FaShippingFast size={25} />
            <span className="card-text">
              <strong>Spedizione gratutia</strong> per ordini superiori a
              29,99&euro;
            </span>
          </div>
        </div>
      </div>

      {/* ACCORDION */}
      <div className="accordion m-5" id="accordionExample">
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
            <div class="accordion-body">
              <strong>{product.description}</strong>
            </div>
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
                <p className="">
                  Il prodotto non deve essere utilizzato da bambini o da persone
                  non in grado di comprendere l’eventuale pericolosità.
                </p>
              </div>
              <div className="text-center">
                <img src={imballaggio} alt="" width={50} />

                <p className="">
                  Imballaggio dell'articolo soggetto al sistema di riciclaggio
                  "Green Dot"
                </p>
              </div>
              <div className="text-center">
                <img src={riciclo} alt="" width={50} />
                <p className="">L'imballaggio dell'articolo è riciclabile </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center m-5">
        <BestsellersList />
      </div>
    </>
  );
}
