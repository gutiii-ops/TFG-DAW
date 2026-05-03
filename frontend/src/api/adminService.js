const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Obtiene los tickets de soporte del backend real.
 * @param {number} page 
 * @returns {Promise<Object>}
 */
export const getSupportTickets = async (page = 1) => {
    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${API_BASE_URL}/support/admin/all?page=${page}&limit=10`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
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
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${API_BASE_URL}/subscriptions?page=${page}&limit=10`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar suscripciones');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { data: [], totalPages: 1 };
    }
};

/**
 * Obtiene el listado de usuarios para el dashboard de admin.
 */
export const getUsers = async (search = '', page = 1) => {
    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${API_BASE_URL}/users?search=${search}&page=${page}&limit=10`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar usuarios');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { users: [], total: 0 };
    }
};

/**
 * Actualiza el rol de un usuario.
 */
export const updateUserRole = async (userId, roleId) => {
    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${API_BASE_URL}/users/role`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, roleId })
        });
        if (!response.ok) throw new Error('Error al actualizar el rol');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Obtiene los mensajes de un ticket específico.
 */
export const getTicketMessages = async (ticketId) => {
    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${API_BASE_URL}/support/tickets/${ticketId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar mensajes del ticket');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * Envía una respuesta a un ticket.
 */
export const replyToTicket = async (ticketId, message) => {
    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${API_BASE_URL}/support/tickets/${ticketId}/messages`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        if (!response.ok) throw new Error('Error al enviar respuesta');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
