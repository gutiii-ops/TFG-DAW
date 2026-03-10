//Archivo que llama a la app y estilos para que se muestren en la página
  //Import base de React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
  //Import de los estilos
import './styles/index.css'
  //Import de la Aplicación
import App from './App.jsx'

//Definición Root para uso de React
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
