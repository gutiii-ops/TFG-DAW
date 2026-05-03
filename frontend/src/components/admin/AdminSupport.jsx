import React, { useState, useEffect, useRef } from 'react';
import { SubViewHeader } from './SubViewHeader';
import { getSupportTickets, getTicketMessages, replyToTicket } from '../../api/adminService';
import '../../styles/components/admin.css';

export const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatEndRef = useRef(null);

  // Cargar lista de tickets al inicio
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const result = await getSupportTickets(1); // Traer primera página
      setTickets(result.data);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  // Cargar mensajes cuando se selecciona un ticket
  useEffect(() => {
    if (selectedTicket) {
      const fetchMessages = async () => {
        setLoadingMessages(true);
        const data = await getTicketMessages(selectedTicket.ticket_id);
        setMessages(data);
        setLoadingMessages(false);
      };
      fetchMessages();
    }
  }, [selectedTicket]);

  // Scroll al final del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;

    try {
      await replyToTicket(selectedTicket.ticket_id, reply);
      // Recargar mensajes
      const updatedMessages = await getTicketMessages(selectedTicket.ticket_id);
      setMessages(updatedMessages);
      setReply('');
    } catch (error) {
      alert("Error al enviar la respuesta");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1: return 'status-dot-open';
      case 2: return 'status-dot-progress';
      case 3: return 'status-dot-closed';
      default: return '';
    }
  };

  return (
    <div className="admin-support-inbox">
      <SubViewHeader title="Centro de Asistencia" />
      
      <div className="inbox-container">
        {/* LISTA DE TICKETS (IZQUIERDA) */}
        <div className="inbox-sidebar">
          <h3>Tickets Recientes</h3>
          {loading ? (
            <div className="inbox-loader">Cargando...</div>
          ) : (
            <div className="ticket-list-scroll">
              {tickets.map(t => (
                <div 
                  key={t.ticket_id} 
                  className={`ticket-item ${selectedTicket?.ticket_id === t.ticket_id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedTicket(t)}
                >
                  <div className="ticket-item-header">
                    <span className={`status-dot ${getStatusClass(t.status)}`}></span>
                    <span className="ticket-user">{t.user_full_name}</span>
                  </div>
                  <p className="ticket-subject">{t.subject}</p>
                  <span className="ticket-date">{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VENTANA DE CONVERSACIÓN (DERECHA) */}
        <div className="inbox-main">
          {selectedTicket ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <h4>{selectedTicket.subject}</h4>
                  <p>Usuario: {selectedTicket.user_full_name}</p>
                </div>
              </div>

              <div className="chat-messages-area">
                {loadingMessages ? (
                  <div className="messages-loader">Cargando conversación...</div>
                ) : (
                  messages.map(m => (
                    <div key={m.message_id} className={`message-bubble ${m.sender_id === selectedTicket.user_id ? 'is-user' : 'is-admin'}`}>
                      <p className="message-text">{m.message_text}</p>
                      <span className="message-time">{new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendReply} className="chat-input-area">
                <textarea 
                  placeholder="Escribe tu respuesta aquí..." 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button type="submit" className="send-reply-btn">Responder</button>
              </form>
            </>
          ) : (
            <div className="no-ticket-selected">
              <div className="empty-chat-icon">💬</div>
              <h3>Selecciona un ticket para ver la conversación</h3>
              <p>Gestiona las consultas de tus usuarios en tiempo real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
