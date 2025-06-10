import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import "../styles/Navbar.css"; // Import your CSS file for styling
import { useCart } from "../context/CartContext"; // <-- Import useCart

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false); 
  const { cartItems } = useCart(); // <-- Get cartItems

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Calculate total quantity in cart
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="logo">
        <h2 className="logo-title">
          Nec<span style={{ color: "#e74c3c", }}>tere</span>
        </h2>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes size={24} color="#fff" /> : <FaBars size={24} color="#fff" />}
      </div>

      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        {user && user.role === "admin" ? (
          <Link to="/admin/*" className="link boxed-link" onClick={closeMenu}>Admin Dashboard</Link>
        ) : (
          <>
            <Link to="/" className="link boxed-link" onClick={closeMenu}>Home</Link>
            {/* Services Dropdown */}
            <div
              className="link boxed-link services-dropdown"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
              style={{ position: "relative" }}
            >
              <span>Services</span>
              {showCategories && (
                <div className="dropdown-menu">
                  <Link to="/services?category=FixUp" className="dropdown-item" onClick={closeMenu}>FixUp</Link>
                  <Link to="/services?category=H2Go" className="dropdown-item" onClick={closeMenu}>H2Go</Link>
                  <Link to="/services?category=PetConnect" className="dropdown-item" onClick={closeMenu}>PetConnect</Link>
                  <Link to="/services?category=Go%20Ride%20Connect" className="dropdown-item" onClick={closeMenu}>Go Ride Connect</Link>
                </div>
              )}
            </div>
            <Link to="/about" className="link boxed-link" onClick={closeMenu}>About</Link>
            {user && <Link to="/profile" className="link boxed-link" onClick={closeMenu}>View Profile</Link>}
          </>
        )}
      </div>

      {/* --- CART ICON + AUTH SECTION --- */}
      <div className="auth-section" style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        {/* Cart Icon with badge */}
        <Link to="/cart" className="cart-link" style={{ marginRight: "8px", display: "flex", alignItems: "center", position: "relative" }}>
          <FaShoppingCart size={22} color="#fff" />
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "#e74c3c",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 7px",
                fontSize: 13,
                fontWeight: 700,
                minWidth: 22,
                textAlign: "center",
                lineHeight: "18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                zIndex: 2,
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
        {/* Auth Buttons */}
        {user ? (
          <>
            <span className="username">Hi, {user.firstname}</span>
            <button onClick={() => { logout(); closeMenu(); }} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="button" onClick={closeMenu}>Login</Link>
            <Link to="/register" className="button" onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;