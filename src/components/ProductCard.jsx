// src/components/ProductCard.jsx
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="image-container">
          <img src={product.images[0]} alt={product.name} />
          <FaHeart className="wishlist-icon" />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">KShs {product.price.toFixed(2)}</p>
          <p className="category">{product.category}</p>
        </div>
      </Link>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
