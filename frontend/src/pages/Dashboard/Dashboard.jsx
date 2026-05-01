import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navbar } from '../../components/navbar';
import '../../styles/pages/dashboard.css';

const Dashboard = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Barra Lateral (La trabajaremos a continuación) */}
        <aside className="dashboard-sidebar">
          <div className="user-info">
            <div className="avatar-placeholder">{user?.name?.[0] || 'U'}</div>
            <div className="user-text">
              <h3>{user?.name || 'Usuario'}</h3>
              <span>{role}</span>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            {/* Los links se inyectarán aquí según el rol */}
            <div className="nav-group">
              <label>General</label>
              <button className="active">Resumen</button>
              <button>Mi Perfil</button>
            </div>

            {role === 'Admin' && (
              <div className="nav-group">
                <label>Gestión</label>
                <button>Usuarios</button>
                <button>Ventas</button>
              </div>
            )}
          </nav>
        </aside>

        {/* Área de Contenido Principal */}
        <main className="dashboard-content">
          <header className="content-header">
            <h1>Bienvenido, {user?.name || 'a tu panel'}</h1>
            <p>Aquí podrás gestionar toda tu actividad en GymMgmt.</p>
          </header>

          <section className="content-grid">
            <div className="empty-state">
              <p>Estamos preparando los módulos de tu panel unificado...</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
