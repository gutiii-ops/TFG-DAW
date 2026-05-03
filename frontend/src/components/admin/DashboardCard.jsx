import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardCard = ({ title, icon, description, to }) => {
  return (
    <Link to={to} className="dashboard-card">
      <div className="dashboard-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
};
