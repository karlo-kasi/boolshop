import React, { useState, useEffect } from "react";

export default function QuantityCounter({ onQuantityChange }) {
  const [quantity, setQuantity] = useState(1); // Stato iniziale della quantità

  useEffect(() => {
    onQuantityChange(quantity); // Comunica la quantità al componente padre
  }, [quantity, onQuantityChange]);

  const handleIncrease = () => {
    setQuantity(quantity + 1); // Incrementa la quantità
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Decrementa la quantità, ma non scendere sotto 1
    }
  };

  return (
    <div className="d-flex align-items-center">
      <button className="btn btn-outline-secondary" onClick={handleDecrease}>
        -
      </button>
      <span className="mx-3">{quantity}</span>
      <button className="btn btn-outline-secondary" onClick={handleIncrease}>
        +
      </button>
    </div>
  );
}
