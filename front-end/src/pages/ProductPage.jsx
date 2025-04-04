import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { useModal } from "../context/ModalContext"; // Import del contesto
import { useWishlist } from "../context/WishlistContext";
import WishlistModal from "../components/WishlistModal";

//COMPONENTS
import QuantityCounter from "../components/QuantityCounter";
import BestsellersList from "../components/BestsellersList";

//ICONS
import { FaHeart } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

//IMAGES ACCORDION
import divieto from "../assets/img/1.avif";
import imballaggio from "../assets/img/2.avif";
import riciclo from "../assets/img/3.avif";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Stato per la quantità
  const { openModal } = useModal(); // Usa il contesto
  const { addToWishlist, wishlist } = useWishlist(); // Importiamo la wishlist
  const [showWishlistModal, setShowWishlistModal] = useState(false);

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

  // Apri la modale quando la wishlist cambia
  useEffect(() => {
    if (showWishlistModal) {
      setShowWishlistModal(true);
    }
  }, [wishlist]);

  // Funzione per aggiornare la quantità
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  // Funzione per aggiungere il prodotto al carrello
  const addToCart = () => {
    if (!product || !product.id || !product.slug) {
      console.error("Prodotto non valido o slug mancante");
      return;
    }

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        slug: product.slug, // Assicurati che slug sia presente
        quantity: quantity,
      };

      const storedCartItems = localStorage.getItem("cartItems");
      const existingCartItems = storedCartItems
        ? JSON.parse(storedCartItems)
        : [];

      const existingProductIndex = existingCartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex > -1) {
        existingCartItems[existingProductIndex].quantity += quantity;
      } else {
        existingCartItems.push(cartItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(existingCartItems));
      console.log("Prodotto aggiunto al carrello:", cartItem); // Debug per verificare lo slug

      // Passa lo stato aggiornato del LocalStorage alla modale
      openModal({ cartItems: existingCartItems });
    } catch (error) {
      console.error("Errore nell'aggiunta al carrello:", error);
    }
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    setShowWishlistModal(true); // Apri la modale della wishlist
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Caricamento...</div>;
  }

  return (
    <>
      {/* ROW SINGLE CARD */}
      <div className="row m-5 justify-content-center" key={product.id}>
        <div className="card text-decoration-none justify-content-center col-sm-12 col-md-7">
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
            <QuantityCounter onQuantityChange={handleQuantityChange} />
            <div className="d-flex gap-4">
              <NavLink
                className="text-black"
                onClick={() => handleAddToWishlist(product)}
              >
                <FaHeart className="heart-icon" size={25} />
              </NavLink>
            </div>
          </div>
          <button
            className="custom-btnCarmelo rounded w-100"
            onClick={addToCart}
          >
            Aggiungi al carrello
          </button>
          <div className=" d-flex flex-column align-items-center gap-2">
            <div className="d-flex gap-2">
              <FiPackage size={30} />
              <p className="card-text">
                <strong>Ordina ora</strong>
                <p>e ricevi in 1-2 giorni lavorativi</p>
              </p>
            </div>
            <div className="d-flex gap-2">
              <FaShippingFast size={30} />
              <p className="card-text">
                <strong>Spedizione Gratuita</strong>
                <p>per ordini superiori a 29,99&euro;</p>
              </p>
            </div>
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
        <NavLink
          to={`/cover${product.slug}`}
          className="text-decoration-none text-black"
          onClick={() => window.scrollTo(0, 0)}
        >
          <BestsellersList />
        </NavLink>
      </div>

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
