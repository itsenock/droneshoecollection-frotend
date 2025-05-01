// src/components/SellerForm.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerForm.css';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const SellerForm = ({ onAddProduct }) => {
  // Expanded state with additional details: model, material, and condition
  const [itemData, setItemData] = useState({
    name: '',
    brand: '',
    model: '',
    size: '',
    color: '',
    description: '',
    price: '',
    category: 'Sneakers',
    origin: '',
    material: '',
    condition: '',
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Verify that the user is logged in as an admin.
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warn('Please log in as admin to add new items.');
      navigate('/login');
      return;
    }
    // Decode token payload (assuming JWT format)
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin') {
      toast.error('Only admins can add new items.');
      navigate('/');
    }
  }, [navigate]);

  // Predefined shoe categories (adjust as necessary)
  const categories = [
    'Sneakers',
    'Boots',
    'Formal Shoes',
    'Casual Shoes',
    'Sports Shoes',
    'Sandals',
  ];

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setItemData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...newImages],
    }));
  };

  const handleRemoveImage = (idx) => {
    setItemData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields (you can adjust required fields as necessary)
    if (
      !itemData.name ||
      !itemData.brand ||
      !itemData.model ||
      !itemData.size ||
      !itemData.color ||
      !itemData.description ||
      !itemData.price ||
      !itemData.category ||
      itemData.images.length === 0
    ) {
      toast.warn('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append each field to the FormData. For images, append each file.
      Object.keys(itemData).forEach((key) => {
        if (key === 'images') {
          itemData[key].forEach((image) => {
            formData.append('images', image.file);
          });
        } else {
          formData.append(key, itemData[key]);
        }
      });

      // Post the FormData to the backend; adjust endpoint as needed
      const response = await axios.post(
        'http://localhost:5000/api/user/item',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onAddProduct(response.data);
      toast.success('Your item has been added.');

      // Reset the form fields
      setItemData({
        name: '',
        brand: '',
        model: '',
        size: '',
        color: '',
        description: '',
        price: '',
        category: 'Sneakers',
        gender: '',
        material: '',
        condition: '',
        images: [],
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sellerForm-container">
      <div className="seller-form">
        <h2>Sell Your Shoe</h2>
        <form onSubmit={handleSubmit}>
          {/* Shoe Name */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="name"
                id="name"
                value={itemData.name}
                onChange={handleItemChange}
                placeholder=" "
                required
              />
              <label htmlFor="name">
                Shoe Name<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Shoe Brand */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="brand"
                id="brand"
                value={itemData.brand}
                onChange={handleItemChange}
                placeholder=" "
                required
              />
              <label htmlFor="brand">
                Shoe Brand<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Shoe Model */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="model"
                id="model"
                value={itemData.model}
                onChange={handleItemChange}
                placeholder=" "
                required
              />
              <label htmlFor="model">
                Shoe Model<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Shoe Size */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="size"
                id="size"
                value={itemData.size}
                onChange={handleItemChange}
                placeholder=" "
                required
              />
              <label htmlFor="size">
                Shoe Size<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Shoe Color */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="color"
                id="color"
                value={itemData.color}
                onChange={handleItemChange}
                placeholder=" "
                required
              />
              <label htmlFor="color">
                Shoe Color<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="input-container">
            <div className="floating-label">
              <textarea
                name="description"
                id="description"
                value={itemData.description}
                onChange={handleItemChange}
                placeholder=" "
                required
              ></textarea>
              <label htmlFor="description">
                Shoe Description<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Shoe Price */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="number"
                name="price"
                id="price"
                value={itemData.price}
                onChange={handleItemChange}
                placeholder=" "
                required
              />
              <label htmlFor="price">
                Shoe Price (Ksh)<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Shoe Category */}
          <div className="input-container">
            <label htmlFor="category">
              Shoe Category<span className="required">*</span>
            </label>
            <select
              name="category"
              id="category"
              value={itemData.category}
              onChange={handleItemChange}
            >
              {categories.map((cat, idx) => (
                <option value={cat} key={idx}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Shoe gender */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="gender"
                id="gender"
                value={itemData.origin}
                onChange={handleItemChange}
                placeholder=" "
              />
              <label htmlFor="gender">Shoe gender </label>
            </div>
          </div>

          {/* Shoe Material */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="material"
                id="material"
                value={itemData.material}
                onChange={handleItemChange}
                placeholder=" "
              />
              <label htmlFor="material">Shoe Material (optional)</label>
            </div>
          </div>

          {/* Shoe Condition */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="condition"
                id="condition"
                value={itemData.condition}
                onChange={handleItemChange}
                placeholder=" "
              />
              <label htmlFor="condition">Shoe Condition (optional)</label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="input-container">
            <label htmlFor="image-input">
              Upload Images<span className="required">*</span>
            </label>
            <div
              className="image-upload"
              title="Upload Images"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="upload-icon">+</div>
              <input
                id="image-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
            </div>
            <div className="image-preview">
              {itemData.images.map((image, idx) => (
                <div key={idx} className="image-container">
                  <img src={image.url} alt={`Preview ${idx}`} />
                  <button type="button" onClick={() => handleRemoveImage(idx)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

SellerForm.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

export default SellerForm;
