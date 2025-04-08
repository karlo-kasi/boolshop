import Karlo from "../assets/img/karlo.png";
import Fabio from "../assets/img/fabio.png";
import Diego from "../assets/img/diego.png";
import Carme from "../assets/img/carme.png";

import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main>
      <div className="container mt-5 mb-5 d-flex flex-column justify-content-center align-items-center">
        <p className="text-center display-1 fw-bold p-3">Chi siamo</p>

        <div className="row gap-3 justify-content-center align-items-center">
          <div className="col-md-5 col-sm-12">
            <p className="text-center">
              Siamo un'azienda dedicata alla vendita di cover per smartphone
              Apple, con una passione per la tecnologia e il design.
            </p>
          </div>
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <img
                src={Karlo}
                width={170}
                height={170}
                alt="Karlo Kasi"
                className="rounded-circle shadow bubble"
                style={{ backgroundColor: "rgba(27, 123, 175, 0.63)" }}
              />
            </div>
          </div>
        </div>

        <div className="row gap-3 justify-content-center align-items-center">
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <img
                src={Fabio}
                width={170}
                height={170}
                alt="Fabio D'agostino"
                className="rounded-circle shadow bubble"
                style={{ backgroundColor: "rgba(235, 213, 13, 0.63)" }}
              />
            </div>
          </div>
          <div className="col-md-5 col-sm-12">
            <p className="text-center">
              Dietro ogni cover c'è una storia di idee condivise, di caffè
              fumanti e di righe infinite di codice .
            </p>
          </div>
        </div>

        <div className="row gap-3 justify-content-center align-items-center">
          <div className="col-md-5 col-sm-12">
            <p className="text-center">
              Non siamo solo Junior Full Stack, ma anche navigatori di sogni,
              con gli occhi fissi sulle infinite possibilità del mare digitale.
            </p>
          </div>
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <img
                src={Diego}
                width={170}
                height={170}
                alt="Karlo Kasi"
                className="rounded-circle shadow bubble"
                style={{ backgroundColor: "rgba(27, 175, 47, 0.63)" }}
              />
            </div>
          </div>
        </div>

        <div className="row gap-3 justify-content-center align-items-center">
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <img
                src={Karlo}
                width={170}
                height={170}
                alt="Karlo Kasi"
                className="rounded-circle shadow bubble"
                style={{ backgroundColor: "rgba(27, 123, 175, 0.63)" }}
              />
            </div>
          </div>
          <div className="col-md-5 col-sm-12">
            <p className="text-center">
              Nelle nostre creazioni splende la magia tech che avvolge i vostri
              device e il nostro futuro.
            </p>
          </div>
        </div>

        <div className="row gap-3 justify-content-center align-items-center">
          <div className="col-md-5 col-sm-12 ">
            <p className="text-center m-1">Creatività: la nostra bussola.</p>
            <p className="text-center m-1">Innovazione: il nostro vento.</p>
            <p className="text-center m-1">
              E ogni riga di codice: il nostro mare.
            </p>
          </div>
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <img
                src={Carme}
                width={170}
                height={170}
                alt="Karlo Kasi"
                className="rounded-circle shadow bubble"
                style={{ backgroundColor: "rgba(121, 27, 175, 0.55)" }}
              />
            </div>
          </div>
        </div>

        <Link to="/home">
          <button className="mt-5 btn btn-outline-primary">Visita il nostro sito</button>
        </Link>
      </div>
    </main>
  );
}
