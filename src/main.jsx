import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import './assets/tailwind.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // Import komponen App
import { AuthProvider } from './guest/context/AuthContext';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);