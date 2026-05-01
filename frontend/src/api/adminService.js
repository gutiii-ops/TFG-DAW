const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Obtiene los tickets de soporte del backend real.
 * @param {number} page 
 * @returns {Promise<Object>}
 */
export const getSupportTickets = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/support?page=${page}&limit=10`);
        if (!response.ok) throw new Error('Error al cargar tickets de soporte');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { data: [], totalPages: 1 };
    }
};

/**
 * Obtiene la lista de productos (para gestión de inventario/tienda admin).
 */
export const getAdminProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Error al cargar productos');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * Obtiene las suscripciones con paginación.
 */
export const getSubscriptions = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/subscriptions?page=${page}&limit=10`);
        if (!response.ok) throw new Error('Error al cargar suscripciones');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { data: [], totalPages: 1 };
    }
};
