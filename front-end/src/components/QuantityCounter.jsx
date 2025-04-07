import React, { useState, useEffect } from "react";

const QuantityCounter = ({ initialValue = 1, onQuantityChange, children }) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    onQuantityChange(newCount);
  };

  const handleDecrement = () => {
    const newCount = Math.max(1, count - 1);
    setCount(newCount);
    onQuantityChange(newCount);
  };

  return (
    <div className="d-flex align-items-center gap-3">
      {children ? (
        children
      ) : (
        <button onClick={handleDecrement} className="btn btn-outline-dark">
          -
        </button>
      )}
      <span>{count}</span>
      <button onClick={handleIncrement} className="btn btn-outline-dark">
        +
      </button>
    </div>
  );
};

export default QuantityCounter;
