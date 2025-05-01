import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';
import {
  FaHome,
  FaBoxOpen,
  FaStore,
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
  FaClipboardList,
  FaUsers,
} from 'react-icons/fa';

const Navbar = () => {
  const { cartItems, clearCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // Role state to differentiate admin and normal users
  const navLinksRef = useRef(null);
  const location = useLocation();

  // Fetch user authentication and role information
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Retrieve role from localStorage
    const storedRole = localStorage.getItem('role'); // Ensure this is being stored by backend
    setRole(storedRole);

    // Clear cart if logged out
    if (!token) {
      clearCart();
    }
  }, [location]);

  // Handle click outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        navLinksRef.current &&
        !navLinksRef.current.contains(event.target) &&
        event.target !== document.querySelector('.menu-icon')
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    // Close menu on small screens
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="logo.jpeg" alt="logo" />
        </Link>
      </div>
      <h1> Drone Shoes Collection</h1>
      <div
        className={`nav-links ${isMenuOpen ? 'open' : ''}`}
        ref={navLinksRef}
      >
        <Link to="/" onClick={handleLinkClick}>
          <FaHome className="icon" />
          Home
        </Link>
        <Link to="/products" onClick={handleLinkClick}>
          <FaBoxOpen className="icon" />
          Products
        </Link>

        {/* Display Sell link for admin only */}
        {role === 'admin' && (
          <Link to="/sell" onClick={handleLinkClick}>
            <FaStore className="icon" />
            Sell
          </Link>
        )}

        <Link to="/cart" onClick={handleLinkClick}>
          <FaShoppingCart className="icon" />
          Cart ({isLoggedIn ? cartItems.length : 0})
        </Link>

        {/* Admin-Specific Links */}
        {role === 'admin' && (
          <>
            <Link to="/orders" onClick={handleLinkClick}>
              <FaClipboardList className="icon" />
              Orders
            </Link>
            <Link to="/users" onClick={handleLinkClick}>
              <FaUsers className="icon" />
              Users
            </Link>
          </>
        )}

        {/* Normal User or Admin */}
        {isLoggedIn ? (
          <Link to="/profile" onClick={handleLinkClick}>
            <FaUser className="icon" />
            Profile
          </Link>
        ) : (
          <Link to="/login" onClick={handleLinkClick}>
            <FaSignInAlt className="icon" />
            Login
          </Link>
        )}
      </div>

      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
    </nav>
  );
};

export default Navbar;
