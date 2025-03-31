import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
        <a className="navbar-brand" href="#">
          <img
            className="logo"
            src="../public/Screenshot 2025-03-30 195327.png"
            alt="boolshop"
          />
          BOOLSHOP
        </a>
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <Link to="/">
            <button className="btn btn-outline-dark m-1">Home</button>
          </Link>
          <button className="btn btn-outline-dark m-1">About Us</button>

          <button className="btn btn-outline-dark m-1">Products</button>

          <button className="btn btn-outline-dark m-1">Contact</button>
          <button className="btn btn-dark d-flex align-items-center m-1">
            🛒 Cart
          </button>
        </div>
      </div>
    </nav>
  );
}
