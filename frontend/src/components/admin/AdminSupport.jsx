import React, { useState, useEffect } from 'react';
import { SubViewHeader } from './SubViewHeader';
import { PaginatedTable } from './PaginatedTable';
import { getSupportTickets } from '../../api/adminService';

export const AdminSupport = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const result = await getSupportTickets(page);
      
      // Mapeamos los datos de la DB a lo que espera la tabla
      const formattedData = result.data.map(t => ({
        id: `#${t.ticket_id}`,
        subject: t.subject,
        user: t.user_full_name,
        status: t.status === 1 ? 'Abierto' : t.status === 2 ? 'En Progreso' : 'Cerrado'
      }));

      setData(formattedData);
      setTotalPages(result.totalPages);
      setLoading(false);
    };

    fetchTickets();
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
