import { Link } from "react-router-dom";

//PAGES
import NewProductsList from "../components/NewProductsList";

//img
import brokenPhone from "../assets/img/brokenPhone.gif";

export default function NotFoundPage() {
  return (
    <>
      <div className="text-center mt-4 mb-5">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <p className="h1">404</p>
          <p className="h2">Pagina non Trovata</p>
          <p className="">
            Impossibile trovare la pagina cercata. Usa la barra di navigazione o
            il pulsante in basso per tornare al sito.
          </p>
          <img
            src={brokenPhone}
            alt="BrokenPhone.gif"
            width={350}
            className="rounded-circle brokenPhone"
          />
          <Link to="/">
            <button className="custom-btnCarmelo btn btn-primary">
              Continua i tuoi acquisti
            </button>
          </Link>
        </div>
      </div>
      <NewProductsList />
    </>
  );
}
