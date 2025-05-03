import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';
import { FaSearch } from 'react-icons/fa'; // For the search icon

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productsByCategory, setProductsByCategory] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');
  const selectedGender = queryParams.get('gender'); // Get gender filter if specified
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://drone-482w.onrender.com/api/products');
        setProducts(response.data);

        // Apply filtering based on category and gender
        let filtered = response.data;

        if (selectedCategory) {
          filtered = filtered.filter(
            (product) => product.category === selectedCategory
          );
        }

        if (selectedGender) {
          filtered = filtered.filter(
            (product) =>
              product.gender === selectedGender || product.gender === 'both'
          );
        }

        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [navigate, selectedCategory, selectedGender]);

  useEffect(() => {
    // Categorize filtered products by category
    const categorizedProducts = filteredProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
    setProductsByCategory(categorizedProducts);
  }, [filteredProducts]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="product-list-page">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>

      {Object.keys(productsByCategory).length === 0 && <p>No products available.</p>}
      {Object.keys(productsByCategory).map((category) => (
        (!selectedCategory || selectedCategory === category) && (
          <div key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="product-list">
              {productsByCategory[category].map((product) => (
                <div className="product-card" key={product._id}>
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={`https://drone-482w.onrender.com${product.images[0]}`}
                      alt={product.name}
                      className="product-image"
                    />
                    <h3>{product.name}</h3>
                    <p>Ksh {product.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

ProductList.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

export default ProductList;
