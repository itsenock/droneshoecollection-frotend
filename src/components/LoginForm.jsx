import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './LoginForm.css';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone_number: '', // renamed to match backend
    password: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTempPassword, setIsTempPassword] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isPasswordUpdateVisible, setIsPasswordUpdateVisible] = useState(false);
  const navigate = useNavigate();

  // Handle input field changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle visibility for password fields.
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle login or registration submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isRegistering) {
        // Registration flow.
        if (formData.password !== formData.confirmPassword) {
          toast.warn('Passwords do not match!');
          return;
        }
        
        response = await axios.post('http://localhost:5000/api/auth/register', {
          fullname: formData.fullname,
          email: formData.email,
          phone_number: formData.phone_number, // using "phone_number"
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        localStorage.setItem('token', response.data.token);
        toast.success('Registration successful!');
        // You can navigate right away, or adjust if you want further steps.
        navigate('/');
      } else {
        // Login flow.
        response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        if (response.data.temp_password) {
          // If the server returns a temporary password flag.
          setIsTempPassword(true);
          setIsPasswordUpdateVisible(true);
        } else {
          setIsFormVisible(false);
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Authentication Error:', error);
      if (error.response && error.response.data) {
        toast.warn(error.response.data.error || 'An error occurred!');
      } else {
        toast.warn('An unknown error occurred. Please try again!');
      }
    }
  };

  // Handle password reset.
  const handlePasswordReset = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email: formData.email });
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Password Reset Error:', error);
      toast.warn('An error occurred! Please try again.');
    }
  };

  // Handle updating the temporary password.
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.warn('New passwords do not match!');
      return;
    }
    try {
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        {
          old_password: formData.password,
          new_password: formData.newPassword,
          confirm_password: formData.confirmNewPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Password updated successfully!');
      setIsPasswordUpdateVisible(false);
      setIsFormVisible(false);
      navigate('/');
    } catch (error) {
      console.error('Password Update Error:', error);
      if (error.response && error.response.data) {
        toast.warn(error.response.data.error || 'An error occurred!');
      } else {
        toast.warn('An unknown error occurred. Please try again!');
      }
    }
  };

  return (
    <div>
      {/* Login/Registration Form */}
      {isFormVisible && !isTempPassword && (
        <div className="modal-background">
          <div className={`login-form ${isRegistering ? 'register-form' : ''}`} onClick={(e) => e.stopPropagation()}>
            <FaTimes className="close-icon" onClick={() => setIsFormVisible(false)} />
            <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <div className="input-container">
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label>Full Name</label>
                  </div>
                  <div className="input-container">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label>Email</label>
                  </div>
                  <div className="input-container">
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label>Phone Number</label>
                  </div>
                </>
              )}
              {!isRegistering && (
                <div className="input-container">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label>Email or Fullname</label>
                </div>
              )}
              <div className="input-container password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Password</label>
                <span onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {isRegistering && (
                <div className="input-container password-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label>Confirm Password</label>
                  <span onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              )}
              {!isRegistering && (
                <div className="forgot-password">
                  <button type="button" onClick={handlePasswordReset}>
                    Forgot Password?
                  </button>
                </div>
              )}
              <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <p onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </p>
          </div>
        </div>
      )}

      {/* Temporary Password Update Form */}
      {isTempPassword && isPasswordUpdateVisible && (
        <div className="modal-background">
          <div className="password-update-form" onClick={(e) => e.stopPropagation()}>
            <FaTimes className="close-icon" onClick={() => setIsPasswordUpdateVisible(false)} />
            <h2>Update Password</h2>
            <form onSubmit={handlePasswordUpdate}>
              <div className="input-container">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>New Password</label>
              </div>
              <div className="input-container">
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Confirm New Password</label>
              </div>
              <button type="submit">Update Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

LoginForm.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default LoginForm;
