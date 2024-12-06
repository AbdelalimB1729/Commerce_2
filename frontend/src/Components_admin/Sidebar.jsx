import React from "react";
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faBook, faUsers, faCog, faSignOutAlt , faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../CSS/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("admin");
    navigate("/auth");
  };

  return (
    <div className="sidebar bg-dark text-white">
      <Nav className="flex-column">
        <Nav.Link href="/admin/dashboard" className="text-white">
          <FontAwesomeIcon icon={faChartLine} /> Dashboard
        </Nav.Link>
        <Nav.Link href="/admin/manage-books" className="text-white">
          <FontAwesomeIcon icon={faBook} /> Manage Books
        </Nav.Link>
        <Nav.Link href="/admin/manage-users" className="text-white">
          <FontAwesomeIcon icon={faUsers} /> Manage Users
        </Nav.Link>
        <Nav.Link href="/admin/manage-orders" className="text-white">
          <FontAwesomeIcon icon={faShoppingCart} /> Manage Orders
        </Nav.Link>
        <Nav.Link href="/admin/settings" className="text-white">
          <FontAwesomeIcon icon={faCog} /> Settings
        </Nav.Link>
        <Nav.Link onClick={handleLogout} className="text-white">
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
