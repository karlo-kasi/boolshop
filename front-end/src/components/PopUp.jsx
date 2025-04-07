import React, { useState, useEffect } from "react";
import axios from "axios";

const PopupComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setTimeout(() => {
        setShowPopup(true);
      }, 3000);
      sessionStorage.setItem("hasSeenPopup", "true");
    }
  }, []);

  const handleRegister = async () => {
    console.log("Email inserita:", email);
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error); // Se la mail esiste già, mostra un errore
      } else {
        alert("Codice sconto inviato alla tua email!");
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  const styles = {
    popup: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    popupContent: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
      width: "90%",
      maxWidth: "400px",
    },
    input: {
      marginTop: "10px",
      padding: "10px",
      width: "80%",
    },
    button: {
      marginTop: "10px",
      marginLeft: "5px",
      padding: "10px 20px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
    closeButton: {
      marginTop: "10px",
      marginLeft: "5px",
      padding: "10px 20px",
      backgroundColor: "#f44336",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    showPopup && (
      <div style={styles.popup}>
        <div style={styles.popupContent}>
          <form onSubmit={handleRegister}>
            <h5>
              Registrati con la tua email e ottieni un 10% di sconto sul tuo
              prossimo ordine!
            </h5>
            <input
              type="email"
              placeholder="Inserisci la tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>
              Registrati
            </button>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              style={styles.closeButton}
            >
              Chiudi
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default PopupComponent;
