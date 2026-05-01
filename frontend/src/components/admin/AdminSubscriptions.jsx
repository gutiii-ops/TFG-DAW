import React, { useState, useEffect } from 'react';
import { SubViewHeader } from './SubViewHeader';
import { PaginatedTable } from './PaginatedTable';

export const AdminSubscriptions = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const totalPages = 5;

  useEffect(() => {
    // Simular fetch al backend con paginación
    const mockData = [
      { id: 101, user: 'Lucía García', plan: 'Premium', status: 'Activa' },
      { id: 102, user: 'Miguel Ángel', plan: 'Básico', status: 'Expirada' },
      { id: 103, user: 'Laura Torres', plan: 'Pro', status: 'Activa' },
    ];
    setData(mockData);
  }, [page]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Usuario', accessor: 'user' },
    { header: 'Plan', accessor: 'plan' },
    { header: 'Estado', accessor: 'status' }
  ];

  return (
    <div>
      <SubViewHeader title="Gestión de Suscripciones" />
      <PaginatedTable 
        columns={columns} 
        data={data} 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
};
