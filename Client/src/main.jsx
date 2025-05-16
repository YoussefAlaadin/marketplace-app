import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '././components/context/UserContext'; // ✅ استدعاء الكونتكست
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider> {/* ✅ لفّ التطبيق بالـ Provider */}
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
