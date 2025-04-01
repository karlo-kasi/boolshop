import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, NavLink } from "react-router-dom";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

export default function Header() {
  return (
    <header className="position-sticky top-0 z-3">
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <Link className="navbar-brand" to={"/"}>
              <img
                className="logo"
                src="../public/boolshop-logo.svg"
                alt="boolshop"
              />
            </Link>
          </div>

          <div className="d-none d-lg-flex">
            <Link to="/">
              <button className="btn btn-outline-dark m-1">Home</button>
            </Link>
            <button className="btn btn-outline-dark m-1">About Us</button>

            <button className="btn btn-outline-dark m-1">Products</button>

            <button className="btn btn-outline-dark m-1">Contact</button>
          </div>
          <div className="d-flex gap-2">
            <NavLink><FaSearch className="fs-3 text-black" /></NavLink>
            <NavLink><FaRegHeart className="fs-3 text-black" /></NavLink>
            <NavLink><FiShoppingCart className="fs-3 text-black" /></NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
