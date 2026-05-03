import React, { createContext, useState, useContext } from 'react';

export const DashboardNavContext = createContext(null);

export const DashboardNavProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('overview');
  return (
    <DashboardNavContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </DashboardNavContext.Provider>
  );
};

export const useDashboardNav = () => useContext(DashboardNavContext);
