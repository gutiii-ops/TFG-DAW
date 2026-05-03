import React from 'react';

const TicketList = ({ tickets, selectedTicket, onSelect, onNewTicket, loading }) => {
  const getStatusLabel = (status) => {
    const labels = {
      1: { text: 'Abierto', class: 'status-open' },
      2: { text: 'En Progreso', class: 'status-progress' },
      3: { text: 'Resuelto', class: 'status-resolved' },
      4: { text: 'Cerrado', class: 'status-closed' }
    };
    return labels[status] || { text: 'Desconocido', class: '' };
  };

  return (
    <div className="ticket-sidebar">
      <div className="sidebar-header">
        <h3>Mis Consultas</h3>
        <button className="new-ticket-btn" onClick={onNewTicket}>
          + Nuevo Ticket
        </button>
      </div>

      <div className="tickets-scroll-area">
        {loading ? (
          <div className="loading-placeholder">Cargando...</div>
        ) : tickets.length === 0 ? (
          <div className="empty-tickets">No tienes tickets abiertos.</div>
        ) : (
          tickets.map(ticket => (
            <div 
              key={ticket.ticket_id} 
              className={`ticket-item ${selectedTicket?.ticket_id === ticket.ticket_id ? 'active' : ''}`}
              onClick={() => onSelect(ticket)}
            >
              <div className="ticket-item-top">
                <span className="ticket-id">#{ticket.ticket_id}</span>
                <span className={`ticket-status ${getStatusLabel(ticket.status).class}`}>
                  {getStatusLabel(ticket.status).text}
                </span>
              </div>
              <h4 className="ticket-subject">{ticket.subject}</h4>
              <span className="ticket-date">
                {new Date(ticket.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;
