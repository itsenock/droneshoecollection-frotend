import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    wishlistItems,
    removeFromCart,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    updateQuantity,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warn('Please log in to access your cart.');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleQuantityChange = (productId, delta) => {
    const item = cartItems.find((item) => item._id === productId);
    if (item && item.available) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateQuantity(item._id, newQuantity);
      }
    }
  };

  const handleMoveToWishlist = async (item) => {
    if (item.available) {
      await addToWishlist(item);
      await removeFromCart(item._id);
    }
  };

  const handleMoveToCart = async (item) => {
    await addToCart(item);
    await removeFromWishlist(item._id);
  };

  const totalAmount = cartItems.reduce(
    (acc, item) =>
      item.available
        ? acc + parseFloat(item.price) * item.quantity
        : acc,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your Cart is Empty</h3>
          <p>Looks like you have not added anything to your cart yet.</p>
          <Link to="/products">Continue Shopping</Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              className={`cart-item ${item.available ? '' : 'unavailable'}`}
              key={item._id}
            >
              <img
                src={`https://campusbackend-production.up.railway.app/${item.images[0]}`}
                alt={item.name}
              />
              <div className="item-details">
                <h3>{item.name}</h3>
                {item.available ? (
                  <>
                    <p>Ksh {parseFloat(item.price).toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item._id, 1)}>
                        +
                      </button>
                    </div>
                    <div className="main-buttons">
                      <button onClick={() => removeFromCart(item._id)}>
                        Remove
                      </button>
                      <button onClick={() => handleMoveToWishlist(item)}>
                        Save for Later
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="unavailable-text">Item is no longer available.</p>
                    <div className="main-buttons">
                      <button onClick={() => removeFromCart(item._id)}>
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="checkout-section">
            <h3>Total: Ksh {totalAmount.toFixed(2)}</h3>
            <button
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
      {wishlistItems.length > 0 && (
        <div className="wishlist">
          <h2>Saved for Later</h2>
          {wishlistItems.map((item) => (
            <div className="wishlist-item" key={item._id}>
              <img
                src={`https://campusbackend-production.up.railway.app/${item.images[0]}`}
                alt={item.name}
              />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Ksh {parseFloat(item.price).toFixed(2)}</p>
                <div className="main-buttons">
                  <button onClick={() => handleMoveToCart(item)}>
                    Move to Cart
                  </button>
                  <button onClick={() => removeFromWishlist(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
