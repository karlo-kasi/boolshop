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

const styles = {
  popup: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-in-out",
  },
  popupContent: {
    backgroundColor: "#ffffff",
    padding: "30px 25px",
    borderRadius: "16px",
    textAlign: "center",
    width: "90%",
    maxWidth: "420px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    animation: "slideUp 0.3s ease-in-out",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  input: {
    marginTop: "15px",
    padding: "12px 14px",
    width: "85%",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: {
    marginTop: "15px",
    marginLeft: "5px",
    padding: "10px 24px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  closeButton: {
    marginTop: "15px",
    marginLeft: "5px",
    padding: "10px 24px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
};

export default PopupComponent;
