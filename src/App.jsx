// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import SellerForm from './components/SellerForm';
import Home from './components/Home';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './contexts/CartContext';

import UserProfile from './components/UserProfile';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import Orders from './admin/Orders';
import Users from './admin/Users';
import Maintenance from './components/Maintenance';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend; public pages can display them.
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://drone-482w.onrender.com/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // When a new product is added by an admin via SellerForm,
  // this function updates the products list.
  const addProductToList = (product) => {
    setProducts([...products, product]);
  };

  // Maintenance flag can be toggled as needed.
  const isUnderMaintenance = false;

  return (
    <CartProvider>
      <Router>
        <ErrorBoundary>
          {isUnderMaintenance ? (
            // In maintenance mode, show only the maintenance page.
            <Routes>
              <Route path="*" element={<Maintenance />} />
            </Routes>
          ) : (
            <>
              <Navbar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList products={products} />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<LoginForm />} />
                  <Route path="/product/:id" element={<ProductDetails products={products} />} />
                  <Route path="/cart" element={<Cart />} />

                  <Route path="/sell" element={<SellerForm onAddProduct={addProductToList} />} />
                  <Route path="/profile" element={<UserProfile />} />
                  {/* Admin Routes */}
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/users" element={<Users />} />

                  {/* Information & Legal Pages */}
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                </Routes>
              </div>
              <Footer />
            </>
          )}
        </ErrorBoundary>
      </Router>
    </CartProvider>
  );
}

export default App;
