import React from 'react';
import { DashboardCard } from './DashboardCard';

export const AdminOverview = () => {
  return (
    <div>
      <h3>Bienvenido, Administrador</h3>
      <p>Desde aquí puedes gestionar el núcleo del gimnasio seleccionando una de las siguientes áreas:</p>
      
      <div className="admin-overview-grid">
        <DashboardCard 
          title="Servicios" 
          description="Administrar y configurar la oferta de clases, rutinas y servicios disponibles para los usuarios."
          icon="🏋️‍♂️"
          to="/dashboard/servicios"
        />
        <DashboardCard 
          title="Suscripciones" 
          description="Controlar las altas, bajas y el estado de las membresías de los usuarios del gimnasio."
          icon="💳"
          to="/dashboard/suscripciones"
        />
        <DashboardCard 
          title="Soporte Técnico" 
          description="Portal de asistencia para la resolución de problemas, consultas o quejas."
          icon="🛠️"
          to="/dashboard/soporte"
        />
      </div>
    </div>
  );
};
