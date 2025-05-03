import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // All products fetched from backend (all approved/shoes items)
  const [products, setProducts] = useState([]);
  // Randomly chosen featured product for the carousel
  const [featuredProduct, setFeaturedProduct] = useState(null);
  // Latest products; here we simply treat the entire list as latest
  const [latestProducts, setLatestProducts] = useState([]);
  // Collections section (unique categories) extracted from products
  const [collections, setCollections] = useState([]);
  // Trusted Brands section (unique brands) extracted from products
  const [brands, setBrands] = useState([]);

  // Fetch products from the backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://drone-482w.onrender.com/api/products');
        const data = await res.json();
        setProducts(data);
        setLatestProducts(data);

        // Set a random featured shoe for the carousel/featured section
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setFeaturedProduct(data[randomIndex]);
        }

        // Extract unique categories for the collections section
        const uniqueCategories = Array.from(new Set(data.map(p => p.category)))
          .map((cat) => {
            const sampleProduct = data.find(p => p.category === cat);
            return {
              id: sampleProduct ? sampleProduct._id : cat,
              name: cat,
              image: sampleProduct && sampleProduct.images && sampleProduct.images.length > 0
                ? sampleProduct.images[0]
                : 'placeholder.jpg',
              description: `Discover our ${cat} collection.`,
            };
          });
        setCollections(uniqueCategories);

        // Extract unique brands for the trusted brands section
        const uniqueBrands = Array.from(new Set(data.map(p => p.brand)))
          .map((br) => {
            const sampleProduct = data.find(p => p.brand === br);
            return {
              id: sampleProduct ? sampleProduct._id : br,
              name: br,
              image: sampleProduct && sampleProduct.images && sampleProduct.images.length > 0
                ? sampleProduct.images[0]
                : 'placeholder.jpg',
            };
          });
        setBrands(uniqueBrands);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Randomize the featured product when an arrow is clicked
  const randomizeFeatured = () => {
    if (products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      setFeaturedProduct(products[randomIndex]);
    }
  };

  // Render Latest Products as product cards
  const renderProductCards = () =>
    latestProducts.map((product) => (
      <div className="product-card" key={product._id}>
        <img
          src={`https://drone-482w.onrender.com/${product.images && product.images.length > 0 ? product.images[0] : 'placeholder.jpg'}`}
          alt={product.name}
          className="product-image"
        />
        <div className="product-details">
          <h3>{product.name}</h3>
          <p className="product-price">KShs {product.price}</p>
          <p className="product-category">{product.category}</p>
          <Link to={`/product/${product._id}`} className="view-details-link">
            View Details
          </Link>
        </div>
      </div>
    ));

  // Render Collection Cards (Top Categories)
  const renderCollectionCards = () =>
    collections.map((col) => (
      <Link
        key={col.id}
        to={`/products?category=${encodeURIComponent(col.name)}`}
        className="collection-card"
      >
        <img
          src={`https://drone-482w.onrender.com/${col.image}`}
          alt={col.name}
        />
        <div className="collection-overlay">
          <h3>{col.name}</h3>
          <p>{col.description}</p>
        </div>
      </Link>
    ));

  // Render Trusted Brands as brand cards
  const renderBrandCards = () =>
    brands.map((brand) => (
      <Link
        key={brand.id}
        to={`/products?brand=${encodeURIComponent(brand.name)}`}
        className="brand-card"
      >
        <img
          src={`https://drone-482w.onrender.com/${brand.image}`}
          alt={brand.name}
        />
        <h3>{brand.name}</h3>
      </Link>
    ));

  return (
    <div className="home">
      {/* Featured Shoe (Carousel) Section */}
      {featuredProduct && (
        <div className="featured-section">
          <h2>Featured Shoe</h2>
          <div className="featured-shoe">
            <img
              src={`https://drone-482w.onrender.com/${featuredProduct.images && featuredProduct.images.length > 0 ? featuredProduct.images[0] : 'placeholder.jpg'}`}
              alt={featuredProduct.name}
              className="featured-image"
            />
            <div className="featured-details">
              <h3>{featuredProduct.name}</h3>
              <p>{featuredProduct.description}</p>
              <p className="featured-price">KShs {featuredProduct.price}</p>
              <Link to={`/product/${featuredProduct._id}`} className="shop-now-btn">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="carousel-arrows">
            <button className="arrow left-arrow" onClick={randomizeFeatured}>
              &#10094;
            </button>
            <button className="arrow right-arrow" onClick={randomizeFeatured}>
              &#10095;
            </button>
          </div>
        </div>
      )}

      {/* Features Banner */}
      <div className="features-banner">
        <div className="feature">
          <img src="logo.jpeg" alt="Free Shipping" />
          <h3>Free Shipping</h3>
          <p>On orders over KShs 10,000</p>
        </div>
        <div className="feature">
          <img src="logo.jpeg" alt="Easy Returns" />
          <h3>Easy Returns</h3>
          <p>1-Day Return Policy</p>
        </div>
        <div className="feature">
          <img src="logo.jpeg" alt="Secure Payment" />
          <h3>Secure Payment</h3>
          <p>100% Secure Payment</p>
        </div>
        <div className="feature">
          <img src="logo.jpeg" alt="Online Support" />
          <h3>Online Support</h3>
        </div>
      </div>

      {/* Collections Section – Top Categories */}
      <div className="collections-section">
        <h2>Top Categories</h2>
        <p>Explore our top categories</p>
        <div className="collections-grid">
          {renderCollectionCards()}
        </div>
      </div>

      {/* Latest Products Section */}
      <div className="latest-products-section">
        <h2>Latest Products</h2>
        <div className="products-grid">
          {renderProductCards()}
        </div>
      </div>

      {/* Trusted Brands Section */}
      <div className="trusted-brands-section">
        <h2>Trusted Brands</h2>
        <p>Shop shoes from your trusted brands</p>
        <div className="brands-grid">
          {renderBrandCards()}
        </div>
      </div>
    </div>
  );
};

export default Home;
