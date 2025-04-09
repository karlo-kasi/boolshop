import React, { useState, useRef } from "react";

export default function PressAndHoldButton({
  onHoldComplete,
  children,
  className,
  type,
}) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const progressInterval = useRef(null);
  const holdDuration = 1000; // Durata totale in ms
  const updateInterval = 10; // Intervallo di aggiornamento in ms

  const startHolding = () => {
    setIsHolding(true);
    setProgress(0);

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (updateInterval / holdDuration) * 100;

        if (newProgress >= 100) {
          clearInterval(progressInterval.current);
          onHoldComplete();
          setIsHolding(false);
          return 0;
        }

        return newProgress;
      });
    }, updateInterval);
  };

  const stopHolding = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      setProgress(0);
      setIsHolding(false);
    }
  };

  return (
    <button
      type={type}
      className={`press-hold-btn ${className || ""} ${
        isHolding ? "holding" : ""
      }`}
      onMouseDown={startHolding}
      onMouseUp={stopHolding}
      onMouseLeave={stopHolding}
      onTouchStart={startHolding}
      onTouchEnd={stopHolding}
    >
      <span>{children}</span>
      <div className="press-hold-progress" style={{ width: `${progress}%` }} />
    </button>
  );
}
