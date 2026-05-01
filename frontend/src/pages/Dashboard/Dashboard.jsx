import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navbar } from '../../components/navbar';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';
import '../../styles/pages/dashboard.css';

// Iconos SVG Inline para las Status Cards
const PlanIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
const ShoppingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg>;
const SupportIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;

const Dashboard = () => {
  const { user, role } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({ total: '0.00€', lastDate: 'Sin pedidos', count: 0 });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_token');
        
        // Fetch de pedidos reales
        const response = await fetch(`http://localhost:3000/api/orders/user/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const orders = await response.json();
          if (orders.length > 0) {
            const total = orders.reduce((acc, curr) => acc + Number(curr.total_price), 0);
            const lastOrder = orders[0]; // Ordenado por fecha DESC en el repo
            const lastDate = new Date(lastOrder.order_date).toLocaleDateString('es-ES', {
              day: '2-digit', month: 'short'
            });

            setOrderStats({
              total: `${total.toFixed(2)}€`,
              lastDate: `Último: ${lastDate}`,
              count: orders.length
            });
          }
        }
      } catch (error) {
        console.error("Error cargando el dashboard:", error);
      } finally {
        // Pequeño delay artificial para que el spinner luzca mejor y no parpadee
        setTimeout(() => setLoading(false), 600);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user]);

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      <div className="dashboard-container">
        <DashboardSidebar 
          user={user} 
          role={role} 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />

        <main className="dashboard-content">
          {loading ? (
            <div className="dashboard-loader">
              <div className="minimal-spinner"></div>
              <p>Sincronizando tus datos...</p>
            </div>
          ) : (
            <>
              <header className="content-header">
                <h1>Bienvenido, {user?.name || 'Guerrero'}</h1>
                <p>Este es el resumen de tu actividad actual en el centro.</p>
              </header>

              {activeSection === 'overview' && (
                <section className="dashboard-overview">
                  <div className="status-cards-grid">
                    <DashboardCard 
                      icon={<PlanIcon />}
                      title="Membresía Activa"
                      value="Sin suscripción"
                      subtext="Consulta nuestros planes"
                    />
                    <DashboardCard 
                      icon={<ShoppingIcon />}
                      title="Compras en Tienda"
                      value={orderStats.total}
                      subtext={orderStats.lastDate}
                    />
                    <DashboardCard 
                      icon={<SupportIcon />}
                      title="Soporte Técnico"
                      value="0"
                      subtext="No tienes tickets abiertos"
                    />
                  </div>
                  
                  <div className="recent-activity-placeholder">
                    <h2>Módulos Activos</h2>
                    <p>Ahora puedes ver tu gasto real acumulado en tienda. Pronto añadiremos el detalle de suscripciones.</p>
                  </div>
                </section>
              )}

              {activeSection !== 'overview' && (
                <div className="empty-state">
                  <p>El módulo de <strong>{activeSection}</strong> está siendo configurado para tu cuenta.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
