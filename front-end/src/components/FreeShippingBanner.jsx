import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FreeShippingBanner = () => {
  return (
    <div className="bg-success text-white text-center py-2 w-100">
      <p className="mb-0 fw-bold">
        🎉 Spedizione gratuita sugli ordini superiori ai 99€ 🎉
      </p>
    </div>
  );
};

export default FreeShippingBanner;
