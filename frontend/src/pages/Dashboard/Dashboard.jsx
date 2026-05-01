import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AdminView } from '../../components/dashboard/AdminView';
import { CoachView } from '../../components/dashboard/CoachView';
import { UserView } from '../../components/dashboard/UserView';
import { Navbar } from '../../components/navbar';

export default function Dashboard() {
  const { role } = useContext(AuthContext);

  const renderDashboardByRole = () => {
    switch (role) {
      case 'Admin':
        return <AdminView />;
      case 'Coach':
        return <CoachView />;
      case 'User':
      default:
        return <UserView />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main style={{ padding: '6rem 2rem 2rem 2rem' }}>
        {renderDashboardByRole()}
      </main>
    </div>
  );
}
