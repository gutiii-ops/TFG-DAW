import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const DashboardSidebar = ({ user, role, activeSection, onSectionChange }) => {
  const { hasPermission } = useContext(AuthContext);

  const menuGroups = [
    {
      label: 'General',
      items: [
        { id: 'overview', label: 'Resumen', permission: 'VIEW_DASHBOARD' },
        { id: 'profile', label: 'Mi Perfil', permission: 'VIEW_DASHBOARD' },
      ]
    },
    {
      label: 'Tu Actividad',
      items: [
        { id: 'orders', label: 'Mis Compras', permission: 'VIEW_DASHBOARD' },
        { id: 'subscriptions', label: 'Membresía', roles: ['User'] }, // Especial para clientes
        { id: 'coaching', label: 'Coaching', roles: ['User', 'Coach', 'Admin'] },
        { id: 'support', label: 'Soporte', permission: 'VIEW_DASHBOARD' },
      ]
    },
    {
      label: 'Gestión',
      items: [
        { id: 'users-admin', label: 'Usuarios', permission: 'MANAGE_USERS' },
        { id: 'admin-support', label: 'Asistencia Admin', permission: 'MANAGE_SUPPORT' },
        { id: 'inventory', label: 'Inventario', permission: 'MANAGE_INVENTORY' },
      ]
    }
  ];

  return (
    <div className="sidebar-main-wrapper">
      {/* SECCIÓN 1: PERFIL DEL USUARIO */}
      <div className="sidebar-profile-block">
        <div className="sidebar-avatar-frame">
          {user?.name?.[0] || 'U'}
        </div>
        <div className="sidebar-user-info">
          <p className="user-name-label">{user?.name || 'Usuario'}</p>
          <p className="user-role-badge">{role}</p>
        </div>
      </div>

      {/* SECCIÓN 2: MENÚ DE NAVEGACIÓN */}
      <div className="sidebar-nav-container">
        {menuGroups.map((group, idx) => {
          // Filtrar grupos que no tengan ningún item visible
          const visibleItems = group.items.filter(item => {
            if (item.permission) return hasPermission(item.permission);
            if (item.roles) return item.roles.includes(role);
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="nav-menu-group">
              <span className="menu-group-title">{group.label}</span>
              <div className="menu-items-list">
                {visibleItems.map((item) => (
                  <button 
                    key={item.id}
                    className={`sidebar-action-btn ${activeSection === item.id ? 'is-active' : ''}`}
                    onClick={() => onSectionChange(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSidebar;
