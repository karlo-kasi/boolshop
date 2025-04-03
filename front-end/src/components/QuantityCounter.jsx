import React, { useState } from "react";

const QuantityCounter = ({ initialValue = 1, onQuantityChange }) => {
  const [count, setCount] = useState(initialValue);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    onQuantityChange(newCount); // Chiama onQuantityChange solo qui
  };

  const handleDecrement = () => {
    const newCount = Math.max(1, count - 1);
    setCount(newCount);
    onQuantityChange(newCount); // Chiama onQuantityChange solo qui
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <button onClick={handleDecrement} className="btn btn-outline-dark">
        -
      </button>
      <span>{count}</span>
      <button onClick={handleIncrement} className="btn btn-outline-dark">
        +
      </button>
    </div>
  );
};

export default QuantityCounter;
