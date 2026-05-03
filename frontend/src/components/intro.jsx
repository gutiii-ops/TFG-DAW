import React from 'react'
import '../styles/components/intro.css'

const Intro = () => {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="hero-tag">⚡ Abierto · 6am–11pm · 365 días</div>
      <h1>Entrena.<em>Sin límites.</em></h1>
      <p className="hero-sub">El gimnasio que te equipa, te alimenta y te reserva un espacio cuando más lo necesitas.</p>
      <div className="hero-btns">
        <a className="btn-primary" href="/store">Ver tienda</a>
        <a className="btn-outline" href="#calendario">Reservar clase</a>
      </div>
      <div className="hero-stats">
        <div className="stat"><div className="stat-num">48+</div><div className="stat-label">Clases / semana</div></div>
        <div className="stat"><div className="stat-num">1.2K</div><div className="stat-label">Miembros activos</div></div>
        <div className="stat"><div className="stat-num">30+</div><div className="stat-label">Instructores</div></div>
        <div className="stat"><div className="stat-num">★ 4.9</div><div className="stat-label">Valoración</div></div>
      </div>
    </section>
  )
}

export default Intro
