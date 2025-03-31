import React, { useState, useEffect } from "react";

export default function Hero() {
  const images = [
    "../public/Slider-desk_16e.jpg",
    "../public/SLIDER-DESK_TITANIUM.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h3 className="d-flex justify-content-center">
        ★ ESPRIMI IL TUO STILE, PROTEGGI IL TUO DEVICE ★
      </h3>
      <div className="hero w-full flex justify-center items-center overflow-hidden">
        <img
          src={images[currentImage]}
          alt="Hero Image"
          className="hero-img"
          style={{ objectFit: "scale-down" }}
        />
      </div>
    </>
  );
}
