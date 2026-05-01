import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../../styles/components/admin.css';

import { AdminOverview } from '../admin/AdminOverview';
import { AdminServices } from '../admin/AdminServices';
import { AdminSubscriptions } from '../admin/AdminSubscriptions';
import { AdminSupport } from '../admin/AdminSupport';

export const AdminView = () => {
  return (
    <div className="admin-container">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/servicios" element={<AdminServices />} />
        <Route path="/suscripciones" element={<AdminSubscriptions />} />
        <Route path="/soporte" element={<AdminSupport />} />
      </Routes>
    </div>
  );
};
