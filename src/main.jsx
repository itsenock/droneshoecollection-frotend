// main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the '/client' import
import App from './App';
import './index.css';// Import your global styles
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your App.
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="bottom-right" // Position toasts at the bottom-right corner
      autoClose={5000}        // Auto-close toasts after 5 seconds
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}             // Right-to-left layout support
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"         // Use a colored theme for toasts
    />
  </React.StrictMode>
);
