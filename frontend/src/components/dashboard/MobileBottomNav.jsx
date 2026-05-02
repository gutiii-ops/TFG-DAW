import React from 'react';

const MobileBottomNav = ({ role, activeSection, onSectionChange }) => {
  const items = [
    { id: 'overview', label: 'Resumen', icon: '📊', roles: ['User', 'Admin', 'Coach'] },
    { id: 'profile', label: 'Perfil', icon: '👤', roles: ['User', 'Admin', 'Coach'] },
    { id: 'coaching', label: 'Coaching', icon: '🏋️', roles: ['User', 'Coach'] },
    { id: 'orders', label: 'Compras', icon: '🛍️', roles: ['User', 'Admin'] },
    { id: 'support', label: 'Soporte', icon: '💬', roles: ['User'] },
  ];

  // Filtrar items por rol
  const filteredItems = items.filter(item => item.roles.includes(role));

  return (
    <div className="mobile-bottom-nav">
      {filteredItems.map(item => (
        <button
          key={item.id}
          className={`bottom-nav-item ${activeSection === item.id ? 'is-active' : ''}`}
          onClick={() => onSectionChange(item.id)}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileBottomNav;
