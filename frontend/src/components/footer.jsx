import '../styles/components/footer.css';
import FacebookIcon from '../assets/icons/facebook-color_icon.svg?react';
import InstagramIcon from '../assets/icons/instagram-color_icon.svg?react';
import TwitterIcon from '../assets/icons/twitter-color_icon.svg?react';

export const Footer = () => {
  return (
    <footer>
      <div className="footer-inner">
        <article className="footer-top">
          <section className="footer-brand">
            <a className="nav-logo" href="/"><span>Gym</span>Mgmt</a>
            <p>El gimnasio que te empuja a ir más lejos. Entrena fuerte, come bien, viste diferente.</p>
            <section className="footer-social">
              <a className="social-btn" href="/"><InstagramIcon className="social-icon"/></a>
              <a className="social-btn" href="/"><TwitterIcon className="social-icon"/></a>
              <a className="social-btn" href="/"><FacebookIcon className="social-icon"/></a>
            </section>
          </section>
          <section className="footer-col">
            <h4>Gimnasio</h4>
            <a href="/">Clases grupales</a>
            <a href="/">Entrenamiento personal</a>
            <a href="/">Zonas de entrenamiento</a>
            <a href="/">Horarios</a>
            <a href="/">Tarifas y bonos</a>
          </section>
          <section className="footer-col">
            <h4>Tienda</h4>
            <a href="/">Merch GymBooSTR</a>
            <a href="/">Suplementación</a>
            <a href="/">Novedades</a>
            <a href="/">Outlet</a>
            <a href="/">Envíos y devoluciones</a>
          </section>
          <section className="footer-col">
            <h4>Info</h4>
            <a href="/">Sobre nosotros</a>
            <a href="/">Blog de entrenamiento</a>
            <a href="/">Trabaja con nosotros</a>
            <a href="/">Contacto</a>
            <a href="/">Aviso legal</a>
          </section>
        </article>
        <section className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} GymBooSTR · Todos los derechos reservados</span>
          <span>Diseñado para romper límites ⚡</span>
        </section>
      </div>
    </footer>
  );
};