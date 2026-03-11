/* =======================================================================================================================
                                main.jsx - Punto de entrada principal para la aplicación React
======================================================================================================================= */

// Imports base de React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import de la Aplicación
import App from './App.jsx'
// Import de estilos globales para la página
import './styles/global.css';

// Definición Root para uso de React
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
