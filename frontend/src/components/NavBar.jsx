import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const goToSection = (id) => {
    navigate("/"); // navigate to main home page
    setMenuActive(false);

    // small delay to ensure home page is rendered
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const goToHome = () => {
    navigate("/"); // logo click goes to home
    setMenuActive(false);
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) setVisible(false);
      else setVisible(true);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${visible ? "visible" : "hidden"}`}>
      <div className="navbar-logo" onClick={goToHome} style={{ cursor: "pointer" }}>
        <h1>CropCure</h1>
      </div>

      <ul className={`navbar-links ${menuActive ? "active" : ""}`}>
        <li>
          <button onClick={() => goToSection("features")}>Features</button>
        </li>
        <li>
          <button onClick={() => goToSection("contact")}>Contact</button>
        </li>
      </ul>

      <div className={`hamburger ${menuActive ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
