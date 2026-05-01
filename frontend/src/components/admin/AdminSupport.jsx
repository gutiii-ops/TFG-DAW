import React, { useState, useEffect } from 'react';
import { SubViewHeader } from './SubViewHeader';
import { PaginatedTable } from './PaginatedTable';

export const AdminSupport = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const totalPages = 2;

  useEffect(() => {
    // Simular fetch al backend con paginación
    const mockData = [
      { id: '#502', subject: 'Problema con acceso', user: 'Laura Torres', status: 'Abierto' },
      { id: '#503', subject: 'Cobro duplicado', user: 'Miguel Ángel', status: 'En Progreso' },
    ];
    setData(mockData);
  }, [page]);

  const columns = [
    { header: 'Ticket', accessor: 'id' },
    { header: 'Asunto', accessor: 'subject' },
    { header: 'Usuario', accessor: 'user' },
    { header: 'Estado', accessor: 'status' }
  ];

  return (
    <div>
      <SubViewHeader title="Soporte Técnico" />
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
