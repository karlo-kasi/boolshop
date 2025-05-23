import Karlo from "../assets/img/karlo.png";
import Fabio from "../assets/img/fabio.png";
import Diego from "../assets/img/diego.png";
import Carme from "../assets/img/carme.png";
import Michael from "../assets/img/michael.png";
import Coding from "../assets/img/coding.gif";
import Phone from "../assets/img/phone.gif";

import "../style/mediaquery.css";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main>
      <div className="container-fluid aboutResponsive  mb-5 d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-column justify-content-center align-items-center mb-5">
          <img
            src={Coding}
            width={250}
            height={150}
            alt="Karlo Kasi"
            className="rounded shadow bubble codingGif"
          />
          <p className="text-center display-2 fw-bold p-3">Chi siamo</p>
        </div>

        <div className="row gap-3 justify-content-center align-items-center">
          <div className="col-md-5 col-sm-12">
            <p className="text-center">
              Siamo un'azienda dedicata alla vendita di cover per smartphone
              Apple, con una passione per la tecnologia e il design.
            </p>
          </div>
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <div>
                {" "}
                <img
                  src={Karlo}
                  width={170}
                  height={170}
                  alt="Karlo Kasi"
                  className="rounded-circle shadow bubble"
                  style={{ backgroundColor: "rgba(27, 123, 175, 0.63)" }}
                />
                <p
                  style={{ color:  "rgb(235, 154, 13)" }}
                  className="nameAbout bubbleName display-6"
                >
                  Karlo Kasi
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row gap-3 justify-content-center align-items-center">
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <div></div>
              <div>
                <img
                  src={Fabio}
                  width={170}
                  height={170}
                  alt="Fabio D'agostino"
                  className="rounded-circle shadow bubble"
                  style={{ backgroundColor: "rgba(235, 213, 13, 0.63)" }}
                />{" "}
                <p
                  className="nameAbout bubbleName display-6"
                  style={{ color: "#B27ECF" }}
                >
                  Fabio D'agostino
                </p>
              </div>
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
              <div>
                <img
                  src={Diego}
                  width={170}
                  height={170}
                  alt="Diego Lenci"
                  className="rounded-circle shadow bubble"
                  style={{ backgroundColor: "rgba(27, 175, 47, 0.63)" }}
                />

                <p
                  className="nameAbout bubbleName display-6"
                  style={{ color: "#EE706B" }}
                >
                  Diego Lenci
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row gap-3 justify-content-center align-items-center">
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <div>
                {" "}
                <img
                  src={Michael}
                  width={170}
                  height={170}
                  alt="Michael Pellizzato"
                  className="rounded-circle shadow bubble"
                  style={{ backgroundColor: "rgba(230, 11, 11, 0.63)" }}
                />
                <p
                  className="nameAbout bubbleName display-6"
                  style={{ color: "#72A7C8" }}
                >
                  Michael Pellizzato
                </p>
              </div>
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
          <div className="col-md-6 col-sm-12">
            <p className="text-center m-1">Creatività: la nostra bussola.</p>
            <p className="text-center m-1">Innovazione: il nostro vento.</p>
            <p className="text-center m-1">
              E ogni riga di codice: il nostro mare.
            </p>
          </div>
          <div className="col-md-5 col-sm-12">
            <div className="text-center">
              <div>
                <img
                  src={Carme}
                  width={170}
                  height={170}
                  alt="Carmelo Ziino"
                  className="rounded-circle shadow bubble"
                  style={{ backgroundColor: "rgba(121, 27, 175, 0.55)" }}
                />

                <p
                  className="nameAbout bubbleName display-6"
                  style={{ color: "#7BC87D" }}
                >
                  Carmelo Ziino
                </p>
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="d-flex flex-column text-decoration-none justify-content-center align-items-center"
        >
          <img
            src={Phone}
            width={270}
            height={225}
            alt="Karlo Kasi"
            className="rounded-circle shadow bubble phoneGif"
          />
          <button className="btn btn-primary ">Visita il nostro sito</button>
        </Link>
      </div>
    </main>
  );
}
