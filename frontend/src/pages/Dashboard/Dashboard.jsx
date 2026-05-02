import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DashboardNavProvider, useDashboardNav } from '../../context/DashboardNavContext';
import { Navbar } from '../../components/navbar';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ProfileSection from '../../components/dashboard/ProfileSection';
import OrdersSection from '../../components/dashboard/OrdersSection';
import SupportSection from '../../components/dashboard/SupportSection';
import MembershipSection from '../../components/dashboard/MembershipSection';
import CoachingSection from '../../components/dashboard/CoachingSection';
import '../../styles/pages/dashboard.css';

import { UserManagement } from '../../components/admin/UserManagement';
import { AdminSupport } from '../../components/admin/AdminSupport';

// Contenido interno del dashboard (consume el contexto)
const DashboardContent = () => {
  const { user, role } = useContext(AuthContext);
  const { activeSection, setActiveSection } = useDashboardNav();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSpent: 0, lastOrder: 'N/A' });
  const userRole = role || 'User';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token || !user?.id) return;

        const response = await fetch(`http://localhost:8000/api/orders/user/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const orders = await response.json();
          const total = orders.reduce((acc, order) => acc + (Number(order.total_price) || 0), 0);
          const lastDate = orders.length > 0
            ? new Date(orders[0].order_date).toLocaleDateString()
            : 'N/A';

          const subRes = await fetch(`http://localhost:8000/api/subscriptions/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const subData = await subRes.json();

          setStats({
            totalSpent: total.toFixed(2),
            lastOrder: lastDate,
            planName: subData.plan_name || 'Sin Plan',
            expiryDate: subData.end_date ? new Date(subData.end_date).toLocaleDateString() : 'N/A'
          });
        }
      } catch (error) {
        console.error("Error cargando el dashboard:", error);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchDashboardData();
  }, [user]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="dashboard-loader">
          <div className="minimal-spinner"></div>
          <p>Preparando tu centro de mando...</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return (
          <>
            <div className="content-header">
              <h1>¡Hola, {user?.name || 'Guerrero'}!</h1>
              <p>Aquí tienes un resumen de tu actividad en la plataforma.</p>
            </div>
            <div className="status-cards-grid">
              <DashboardCard title="Mis Compras" value={`${stats.totalSpent}€`} subtext="Gasto total acumulado" />
              <DashboardCard title="Suscripción" value={stats.planName} subtext={stats.expiryDate !== 'N/A' ? `Vence: ${stats.expiryDate}` : 'No tienes planes activos'} />
              <DashboardCard title="Último Pedido" value={stats.lastOrder} subtext="Fecha de compra" />
            </div>
            <div className="recent-activity-placeholder">
              <h3>Actividad Reciente</h3>
              <p>Próximamente: Listado detallado de tus últimos movimientos.</p>
            </div>
          </>
        );
      case 'profile':      return <ProfileSection user={user} />;
      case 'orders':       return <OrdersSection user={user} />;
      case 'subscriptions': return <MembershipSection user={user} />;
      case 'coaching':     return <CoachingSection />;
      case 'support':      return <SupportSection />;
      case 'users-admin':   return <UserManagement />;
      case 'admin-support': return <AdminSupport />;
      default:
        return (
          <div className="empty-state">
            <h2>Sección en construcción</h2>
            <p>Estamos trabajando para traerte más funcionalidades pronto.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <DashboardSidebar
          user={user}
          role={userRole}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="dashboard-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Wrapper que provee el contexto
const Dashboard = () => (
  <DashboardNavProvider>
    <DashboardContent />
  </DashboardNavProvider>
);

export default Dashboard;

