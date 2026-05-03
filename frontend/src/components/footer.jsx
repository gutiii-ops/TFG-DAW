/* =======================================================================================================================
          footer.jsx - Componente funcional que muestra el pie de página con enlaces y redes sociales
======================================================================================================================= */
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext.js';
// Import de estilos específicos para el pie de página
import '../styles/components/footer.css';
// Imports de iconos SVG como componentes de React
import FacebookIcon from '../assets/icons/facebook-color_icon.svg?react';
import InstagramIcon from '../assets/icons/instagram-color_icon.svg?react';
import TwitterIcon from '../assets/icons/twitter-color_icon.svg?react';

// Componente funcional que agrupa todo el bloque inferior de la aplicación (Footer)
export const Footer = () => {
  const [showLegal, setShowLegal] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleProtectedNavigation = (e, path) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(path);
    } else {
      addNotification('Debes iniciar sesión para acceder a esta sección', 'info');
      const event = new CustomEvent('openLoginModal');
      document.dispatchEvent(event);
    }
  };

  return (
    <footer>
      <div className="footer-inner">
        <article className="footer-top">
          <section className="footer-brand">
            <Link className="nav-logo" to="/"><span>Gym</span>Mgmt</Link>
            <p>El gimnasio que te empuja a ir más lejos. Entrena fuerte, come bien, viste diferente.</p>
            <section className="footer-social">
              <a className="social-btn" href="https://instagram.com" target="_blank" rel="noopener noreferrer"><InstagramIcon className="social-icon"/></a>
              <a className="social-btn" href="https://twitter.com" target="_blank" rel="noopener noreferrer"><TwitterIcon className="social-icon"/></a>
              <a className="social-btn" href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FacebookIcon className="social-icon"/></a>
            </section>
          </section>
          
          <section className="footer-col">
            <h4>Gimnasio</h4>
            <Link to="/services">Servicios</Link>
            <a href="/#contacto">Contacto</a>
            <button className="footer-link-btn" onClick={() => setShowLegal(true)}>Aviso Legal</button>
          </section>

          <section className="footer-col">
            <h4>Tienda</h4>
            <Link to="/store">Catálogo</Link>
          </section>

          <section className="footer-col">
            <h4>Cuenta</h4>
            <button className="footer-link-btn" onClick={(e) => handleProtectedNavigation(e, '/panel')}>Mi Panel</button>
            <button className="footer-link-btn" onClick={(e) => handleProtectedNavigation(e, '/panel')}>Mis Compras</button>
          </section>
        </article>

        <section className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} GymMgmt · Todos los derechos reservados</span>
          <span>Diseñado para romper límites ⚡</span>
        </section>
      </div>

      {showLegal && (
        <div className="legal-modal-overlay" onClick={() => setShowLegal(false)}>
          <div className="legal-modal-content" onClick={e => e.stopPropagation()}>
            <button className="legal-modal-close" onClick={() => setShowLegal(false)}>&times;</button>
            <h2>Aviso Legal y Condiciones de Uso</h2>
            <div className="legal-text">
              <h3>1. Información General</h3>
              <p>En cumplimiento con el deber de información general, se comunica que GymMgmt es una plataforma de gestión integral para centros deportivos operada por GymMgmt S.L. Este sistema permite la administración de membresías, venta de productos especializados y reserva de sesiones de coaching personal.</p>
              
              <h3>2. Propiedad Intelectual</h3>
              <p>Todo el software, diseño de interfaz y base de datos relacional (T-SQL) han sido desarrollados como una solución tecnológica avanzada. Queda prohibida la reproducción parcial o total del código fuente sin autorización expresa de la entidad gestora.</p>

              <h3>3. Protección de Datos (RGPD)</h3>
              <p>GymMgmt procesa información sensible incluyendo datos de salud y rendimiento físico. Los datos personales (Email, Teléfono) y financieros se gestionan bajo estándares de cifrado Bcrypt y protocolos de seguridad JWT para garantizar que solo el usuario y los administradores autorizados tengan acceso a la información personal.</p>

              <h3>4. Condiciones de Compra e Inventario</h3>
              <p>Las transacciones realizadas en el apartado "Tienda" están sujetas a la disponibilidad de stock gestionada en tiempo real. GymMgmt se reserva el derecho de cancelar pedidos en caso de falta de inventario o errores en el procesamiento de la venta global.</p>

              <h3>5. Reservas de Coaching</h3>
              <p>Las sesiones de entrenamiento personal están vinculadas a la disponibilidad del personal técnico (Coaches). El sistema permite la reserva y gestión de cancelaciones conforme a la política interna del centro deportivo.</p>

              <h3>6. Responsabilidad del Usuario</h3>
              <p>El usuario es responsable de mantener la confidencialidad de su contraseña y de las acciones realizadas a través de su Dashboard personal.</p>
            </div>
            <button className="legal-modal-accept" onClick={() => setShowLegal(false)}>He leído y acepto</button>
          </div>
        </div>
      )}
    </footer>
  );
};