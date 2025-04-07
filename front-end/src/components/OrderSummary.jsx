import React from "react";
import { Link } from "react-router-dom";

export default function OrderSummary({
  calculateTotal,
  shippingCost,
  totalWithShipping,
  formatPrice,
  isCartEmpty,
}) {
  return (
    <div className="col-lg-4 bg-light rounded-3">
      <div className="p-5">
        <h5 className=" mb-5 mt-2 pt-1 h3">Riepilogo ordine</h5>


        <p>Totale parziale: {formatPrice(calculateTotal())}€</p>
        <p>
          Spedizione:{" "}
          {isCartEmpty
            ? "-"
            : shippingCost === 0
            ? "Gratuita"
            : `${formatPrice(shippingCost)}€`}
        </p>

        {/* Alert spedizione gratuita */}
        {shippingCost !== 0 && (
          <div className="alert alert-info" role="alert">
            Mancano {formatPrice(29.99 - calculateTotal())}€ alla spedizione
            gratuita!
          </div>
        )}

        <hr />
        <h4 className="mb-4">
          Totale: {isCartEmpty ? "0.00" : formatPrice(totalWithShipping)}€
        </h4>
        <Link to="/checkout" className="custom-btnCarmelo rounded w-100">
          Procedi all'ordine
        </Link>
      </div>
    </div>
  );
}
