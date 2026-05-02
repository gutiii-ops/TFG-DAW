import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import TicketList from './TicketList';
import ChatWindow from './ChatWindow';
import NewTicketModal from './NewTicketModal';

const SupportSection = () => {
  const { user, token } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  // 1. Cargar tickets del usuario
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/support/my-tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      addNotification('Error al cargar tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

  // 2. Cargar mensajes al seleccionar un ticket
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedTicket) return;
      try {
        setLoadingChat(true);
        const response = await fetch(`http://localhost:8000/api/support/tickets/${selectedTicket.ticket_id}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        addNotification('Error al cargar la conversación', 'error');
      } finally {
        setLoadingChat(false);
      }
    };

    fetchMessages();
  }, [selectedTicket, token]);

  // 3. Enviar un mensaje
  const handleSendMessage = async (text) => {
    try {
      const response = await fetch(`http://localhost:8000/api/support/tickets/${selectedTicket.ticket_id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ message: text })
      });

      if (response.ok) {
        // Optimistic update o recarga
        const newMessage = {
          ticket_id: selectedTicket.ticket_id,
          sender_id: user.id,
          message_text: text,
          sent_at: new Date().toISOString(),
          user_name: user.name
        };
        setMessages([...messages, newMessage]);
      }
    } catch (error) {
      addNotification('Error al enviar mensaje', 'error');
    }
  };

  // 4. Crear nuevo ticket
  const handleCreateTicket = async (subject, firstMessage) => {
    try {
      const response = await fetch('http://localhost:8000/api/support/tickets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ subject, message: firstMessage })
      });

      if (response.ok) {
        addNotification('Ticket creado correctamente', 'success');
        setIsModalOpen(false);
        fetchTickets(); // Recargar lista
      }
    } catch (error) {
      addNotification('Error al crear ticket', 'error');
    }
  };

  return (
    <div className="support-module-wrapper">
      <div className="support-layout">
        <TicketList 
          tickets={tickets} 
          selectedTicket={selectedTicket} 
          onSelect={setSelectedTicket}
          onNewTicket={() => setIsModalOpen(true)}
          loading={loading}
        />
        
        <ChatWindow 
          ticket={selectedTicket} 
          messages={messages} 
          onSend={handleSendMessage}
          loading={loadingChat}
          currentUserId={user?.id}
        />
      </div>

      {isModalOpen && (
        <NewTicketModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleCreateTicket} 
        />
      )}
    </div>
  );
};

export default SupportSection;
