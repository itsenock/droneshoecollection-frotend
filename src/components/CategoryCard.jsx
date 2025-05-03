// src/components/CategoryCard.jsx
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="category-card">
      <div
        className="category-image"
        style={{ backgroundImage: `url(https://drone-482w.onrender.com/${category.image})` }}
      >
        <div className="overlay">
          <h3>{category.name}</h3>
          {category.description && <p>{category.description}</p>}
        </div>
      </div>
    </Link>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default CategoryCard;
