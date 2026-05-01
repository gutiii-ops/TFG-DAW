import React from 'react';
import { Link } from 'react-router-dom';

export const SubViewHeader = ({ title }) => {
  return (
    <div className="subview-header">
      <Link to="/dashboard" className="back-button">
        ← Volver
      </Link>
      <h2>{title}</h2>
    </div>
  );
};
