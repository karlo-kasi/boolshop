import React, { useState, useEffect } from "react";

const PopupComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setTimeout(() => {
        setShowPopup(true);
      }, 3000);
      sessionStorage.setItem("hasSeenPopup", "true");
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!accepted) {
      setErrorMessage("Accetta la privacy policy per continuare.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cover/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage("Errore durante la registrazione. Riprova.")
        return
      } else {
        ; // chiudi popup in modo silenzioso
        setSuccessMessage("Iscrizione avvenuta con successo! Controlla la tua email.");
        setErrorMessage(""); // Rimuovi eventuali messaggi di errore precedenti
      }
    } catch (error) {
      console.error("Errore:", error);
      setErrorMessage("Si è verificato un errore. Riprova più tardi.");
      setSuccessMessage(""); // Rimuovi eventuali messaggi di successo
    }
  };

  if (!showPopup) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div className="row g-0">
          {/* Colonna immagine */}
          <div className="col-md-6 d-none d-md-block">
            <img
              src="../cover-pop.jpg"
              alt="newsletter"
              className="img-fluid h-100 w-100 object-fit-cover"
            />
          </div>

          {/* Colonna form */}
          <div className="col-md-6 bg-white p-5 d-flex flex-column justify-content-center" style={{ position: "relative" }}>
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            ></button>

            <h2 className="fw-bold mb-3">Iscriviti alla newsletter e risparmia il 10%!</h2>
            <p className="mb-4">
              Lascia la tua email per ricevere il tuo COUPON e rimanere aggiornato su offerte e novità esclusive.

            </p>

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control form-control-lg rounded-0"
                  placeholder="Inserisci la tua migliore email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="privacy"
                  checked={accepted}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    setErrorMessage(""); // Rimuovi l'errore se l'utente accetta
                  }}
                />
                <label className="form-check-label" htmlFor="privacy">
                  Accetta i <a href="#" target="_blank" rel="noreferrer">termini e condizioni</a>
                </label>
              </div>
              {errorMessage && (
                <p className="text-danger">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-success">{successMessage}</p>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-0"
              >
                ISCRIVITI
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    width: "95%",
    maxWidth: "800px",
    backgroundColor: "#fff",
    borderRadius: "0",
    overflow: "hidden",
  },
};


export default PopupComponent;
