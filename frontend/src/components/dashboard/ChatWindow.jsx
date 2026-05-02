import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = ({ ticket, messages, onSend, loading, currentUserId }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSend(inputText);
    setInputText('');
  };

  const formatMessageTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return `${date.toLocaleDateString([], { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  if (!ticket) {
    return (
      <div className="chat-window-empty">
        <div className="empty-chat-illustration">💬</div>
        <h3>Centro de Soporte</h3>
        <p>Selecciona un ticket de la lista o crea uno nuevo para empezar a hablar con nuestro equipo.</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-ticket-info">
          <span className="chat-ticket-id">#{ticket.ticket_id}</span>
          <h3>{ticket.subject}</h3>
        </div>
      </div>

      <div className="chat-messages-area">
        {loading ? (
          <div className="loading-chat">Cargando conversación...</div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`message-bubble-wrapper ${msg.sender_id === currentUserId ? 'own' : 'staff'}`}
            >
              <div className="message-bubble">
                <p>{msg.message_text}</p>
                <span className="message-time">
                  {formatMessageTime(msg.sent_at)}
                </span>
              </div>
              <span className="message-author">
                {msg.sender_id === currentUserId ? 'Tú' : msg.user_name}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Escribe tu mensaje..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" disabled={!inputText.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
