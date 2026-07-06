import React, { useState, useEffect, useContext } from 'react';
import { SubViewHeader } from './SubViewHeader';
import { getUsers, updateUserRole } from '../../api/adminService';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/components/admin.css';

export const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [roles] = useState([
    { id: 1, name: 'User' },
    { id: 2, name: 'Coach' },
    { id: 3, name: 'Admin' }
  ]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(search, page);
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleRoleChange = async (userId, roleId) => {
    try {
      await updateUserRole(userId, roleId);
      // Actualizar localmente para feedback inmediato
      setUsers(prev => prev.map(u => 
        u.user_id === userId 
          ? { ...u, role_id: roleId, role_name: roles.find(r => r.id === Number(roleId)).name }
          : u
      ));
      // Opcional: Recargar para traer los permisos actualizados del nuevo rol
      fetchUsers();
    } catch (error) {
      alert(error.message || "Error al cambiar el rol");
    }
  };

  const totalPages = Math.ceil(totalUsers / 10);

  return (
    <div className="admin-section-container">
      <SubViewHeader title="Gestión de Usuarios" />
      
      <div className="admin-filters-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          <button type="submit" className="admin-search-btn">Buscar</button>
        </form>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="table-loader">Cargando usuarios...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Permisos</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-mini">{u.user_name[0]}</div>
                      <span>{u.user_name} {u.user_surname}</span>
                    </div>
                  </td>
                  <td>{u.user_email}</td>
                  <td>
                    <select 
                      value={u.role_id || ''} 
                      onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                      className="role-selector-inline"
                      disabled={u.role_name === 'Admin' || Number(u.user_id) === Number(user?.id)}
                      title={u.role_name === 'Admin' || Number(u.user_id) === Number(user?.id) ? "No se puede modificar el rol de Administradores ni el propio" : "Cambiar rol"}
                    >
                      <option value="" disabled>Sin Rol</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="permissions-tags">
                      {u.permissions && u.permissions.map((p, idx) => (
                        <span key={idx} className="permission-tag">{p}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
            <span>Página {page} de {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
          </div>
        )}
      </div>
    </div>
  );
};
