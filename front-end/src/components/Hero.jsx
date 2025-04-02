import React, { useState, useEffect } from "react";

export default function Hero() {
  const images = [
    "../Slider-desk_16e.jpg",
    "../SLIDER-DESK_TITANIUM.jpg",
    "../slider_cover_copia_1.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-5">
      <div className="hero overflow-hidden mt-4 shadow-lg rounded-4 gap-4">
        <img
          src={images[currentImage]}
          alt="Hero Image"
          className="hero-img rounded-4"
          style={{ objectFit: "scale-down" }}
        />
      </div>
      <h3 className="text-center mt-4">
        ESPRIMI IL TUO STILE, PROTEGGI IL TUO DEVICE
      </h3>
    </div>
  );
}
