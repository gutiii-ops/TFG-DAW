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
    <aside className="dashboard-sidebar">
      <div className="user-info">
        <div className="avatar-placeholder">{user?.name?.[0] || 'U'}</div>
        <div className="user-text">
          <h3>{user?.name || 'Usuario'}</h3>
          <span>{role}</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuGroups.map((group, idx) => {
          // Si el grupo es exclusivo de ciertos roles y el usuario no lo tiene, saltar
          if (group.roles && !group.roles.includes(role)) return null;

          return (
            <div key={idx} className="nav-group">
              <label>{group.label}</label>
              {group.items.map((item) => {
                if (!item.roles.includes(role)) return null;
                return (
                  <button 
                    key={item.id}
                    className={activeSection === item.id ? 'active' : ''}
                    onClick={() => onSectionChange(item.id)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
