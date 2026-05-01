import React, { useState, useEffect } from 'react';
import { SubViewHeader } from './SubViewHeader';
import { PaginatedTable } from './PaginatedTable';
import { getSubscriptions } from '../../api/adminService';

export const AdminSubscriptions = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      const result = await getSubscriptions(page);
      
      const formattedData = result.data.map(s => ({
        id: s.subscription_id,
        user: s.user_name,
        plan: s.plan,
        status: s.status === 1 ? 'Activa' : 'Expirada'
      }));

      setData(formattedData);
      setTotalPages(result.totalPages);
      setLoading(false);
    };

    fetchSubscriptions();
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
