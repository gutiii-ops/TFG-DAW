import React, { createContext, useState, useEffect } from 'react';

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
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) {
      const decoded = decodeJWT(savedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.userId, name: decoded.userName });
        setRole(decoded.role);
        setToken(savedToken);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    const decoded = decodeJWT(newToken);
    if (decoded) {
      setUser({ id: decoded.userId, name: decoded.userName });
      setRole(decoded.role);
      setToken(newToken);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    setUser(null);
    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
