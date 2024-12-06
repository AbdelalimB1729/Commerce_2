import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; 
import "../CSS/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate(); 

  const user = Cookies.get("user");

  const handleLogout = () => {
    Cookies.remove("user"); 
    navigate("/auth"); 
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="logo.PNG" alt="BookNest Logo" className="logo-image" />
        <h1>BookNest</h1>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search books, authors, ISBN..." />
      </div>
      <ul className="nav-links">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/shop">Shop</a>
        </li>
        <li>
          <a href="/about">About Us</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
        <li>
          <a href="/cart">Cart</a>
        </li>
        {user ? (
          <li>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <a href="/auth">
              <span>Login/Register</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
