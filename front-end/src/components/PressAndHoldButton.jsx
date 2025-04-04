import React from "react";

export default function PressAndHoldButton({
  onHoldComplete,
  children,
  className,
}) {
  const handleMouseDown = (e) => {
    const colorClass = className.includes("btn-wishlist-red")
      ? "hold-progress-red"
      : "hold-progress-green";
    e.target.classList.add(colorClass);
    e.target.holdTimeout = setTimeout(() => {
      onHoldComplete();
      e.target.classList.remove(colorClass);
    }, 3000);
  };

  const handleMouseUpOrLeave = (e) => {
    clearTimeout(e.target.holdTimeout);
    e.target.classList.remove("hold-progress-red");
    e.target.classList.remove("hold-progress-green");
  };

  return (
    <button
      className={className}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {children}
    </button>
  );
}
