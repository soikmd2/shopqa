import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { LojaProvider } from './context/LojaContext.jsx';
import { inicializarDados } from './services/api.js';
import './styles.css';

inicializarDados();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LojaProvider>
      <App />
    </LojaProvider>
  </React.StrictMode>
);
