import { createContext, useContext } from 'react';

// 1. Creamos el objeto Context puro
export const NotificationContext = createContext();

// 2. Creamos el Hook personalizado aquí
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification debe usarse dentro de un NotificationProvider');
    }
    return context;
};
