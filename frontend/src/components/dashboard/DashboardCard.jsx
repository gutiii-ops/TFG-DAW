import React from 'react';
import '../../styles/components/dashboard/DashboardCard.css';

/**
 * Tarjeta con efecto Glassmorphism para el panel de control.
 * @param {React.ReactNode} icon - Icono SVG a mostrar.
 * @param {string} title - Título de la tarjeta.
 * @param {string|number} value - El dato principal a resaltar.
 * @param {string} subtext - Texto secundario o descripción.
 * @param {string} trend - Opcional: para mostrar variaciones (ej: "+12%").
 */
const DashboardCard = ({ icon, title, value, subtext, trend }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        {trend && <span className="card-trend">{trend}</span>}
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        <p className="card-value">{value}</p>
        <p className="card-subtext">{subtext}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
