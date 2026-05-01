import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Decodifica manualmente el payload de un JWT (no valida firma, solo lee)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inicializa el estado leyendo el localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded.userId);
        setRole(decoded.role);
        setIsAuthenticated(true);
      } else {
        // Token expirado
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('jwt_token', token);
    const decoded = decodeJWT(token);
    if (decoded) {
      setUser(decoded.userId);
      setRole(decoded.role);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    // Eliminación segura de cualquier rastro de la sesión
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token'); // Por si quedó de la versión anterior
    localStorage.removeItem('userId'); // Por si quedó de la versión anterior
    
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
