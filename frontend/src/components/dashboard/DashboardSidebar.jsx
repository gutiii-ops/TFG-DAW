import React from 'react';

const DashboardSidebar = ({ user, role, activeSection, onSectionChange }) => {
  const menuGroups = [
    {
      label: 'General',
      items: [
        { id: 'overview', label: 'Resumen', roles: ['User', 'Admin', 'Coach'] },
        { id: 'profile', label: 'Mi Perfil', roles: ['User', 'Admin', 'Coach'] },
      ]
    },
    {
      label: 'Tu Actividad',
      items: [
        { id: 'orders', label: 'Mis Compras', roles: ['User', 'Admin'] },
        { id: 'subscriptions', label: 'Membresía', roles: ['User'] },
        { id: 'support', label: 'Soporte', roles: ['User'] },
      ]
    },
    {
      label: 'Gestión',
      roles: ['Admin'],
      items: [
        { id: 'users-admin', label: 'Usuarios', roles: ['Admin'] },
        { id: 'inventory', label: 'Inventario', roles: ['Admin'] },
        { id: 'sales', label: 'Ventas Globales', roles: ['Admin'] },
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
          if (group.roles && !group.roles.includes(role)) return null;

          return (
            <div key={idx} className="nav-menu-group">
              <span className="menu-group-title">{group.label}</span>
              <div className="menu-items-list">
                {group.items.map((item) => {
                  if (!item.roles.includes(role)) return null;
                  return (
                    <button 
                      key={item.id}
                      className={`sidebar-action-btn ${activeSection === item.id ? 'is-active' : ''}`}
                      onClick={() => onSectionChange(item.id)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSidebar;
