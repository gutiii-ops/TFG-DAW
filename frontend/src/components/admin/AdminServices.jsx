import React, { useState, useEffect } from 'react';
import { SubViewHeader } from './SubViewHeader';
import { PaginatedTable } from './PaginatedTable';

export const AdminServices = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const totalPages = 3; // Mock por ahora

  useEffect(() => {
    // Simular fetch al backend con paginación
    const mockData = [
      { id: 1, name: 'Crossfit', instructor: 'Carlos M.', status: 'Activo' },
      { id: 2, name: 'Yoga', instructor: 'Ana G.', status: 'Activo' },
      { id: 3, name: 'Zumba', instructor: 'Elena P.', status: 'Inactivo' },
    ];
    setData(mockData);
  }, [page]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre del Servicio', accessor: 'name' },
    { header: 'Instructor Principal', accessor: 'instructor' },
    { header: 'Estado', accessor: 'status' }
  ];

  return (
    <div>
      <SubViewHeader title="Gestión de Servicios" />
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
