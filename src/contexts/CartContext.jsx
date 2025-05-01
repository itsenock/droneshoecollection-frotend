
import PropTypes from 'prop-types';
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  wishlistItems: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return { ...state, cartItems: action.payload };
    case 'SET_WISHLIST_ITEMS':
      return { ...state, wishlistItems: action.payload };
    case 'CLEAR_CART_ITEMS':
      return { ...state, cartItems: [] };
    case 'ADD_TO_CART': {
      const itemExists = state.cartItems.some(
        (item) => item.product_id === action.payload.product_id
      );
      if (itemExists) {
        return state; // Item already exists in the cart, do not add it again
      }
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item._id !== action.payload._id),
      };
    case 'ADD_TO_WISHLIST': {
      return { ...state, wishlistItems: [...state.wishlistItems, action.payload] };
    }
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (item) => item._id !== action.payload._id
        ),
      };
    case 'UPDATE_QUANTITY': {
      const updatedCartItems = state.cartItems.map((item) =>
        item._id === action.payload._id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, cartItems: updatedCartItems };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const fetchCartItems = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'CLEAR_CART_ITEMS' });
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/user/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({ type: 'SET_CART_ITEMS', payload: response.data });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/user/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({ type: 'SET_WISHLIST_ITEMS', payload: response.data });
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
        }
      }
    };

    fetchWishlistItems();
  }, []);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/cart',
        {
          product_id: product.product_id,
          quantity: product.quantity || 1,
          name: product.name,
          price: product.price,
          images: product.images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch({ type: 'ADD_TO_CART', payload: response.data });
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
      } else if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/user/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'REMOVE_FROM_CART', payload: { _id: productId } });
    } catch (error) {
      console.error('Error removing from cart:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
      }
    }
  };

  const addToWishlist = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/wishlist',
        {
          product_id: product.product_id,
          name: product.name,
          price: product.price,
          images: product.images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch({ type: 'ADD_TO_WISHLIST', payload: response.data });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
      } else if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/user/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { _id: productId } });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:5000/api/user/cart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch({ type: 'UPDATE_QUANTITY', payload: { _id: productId, quantity } });
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
      }
    }
  };

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART_ITEMS' });
  }, [dispatch]);

  // Expose fetchCartItems to allow other components to refresh the cart
  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        updateQuantity,
        clearCart,
        fetchCartItems, // Exposed function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);
