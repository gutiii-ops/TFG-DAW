-- =========================================================================================
--							MÓDULO 4: ASISTENCIA TÉCNICA (SOPORTE)
-- =========================================================================================

/* 
Este Script define la estructura para el sistema de tickets de soporte.
Depende de la tabla 'users' definida en UserCore.sql.
*/

BEGIN TRANSACTION;

/* Tabla: support_tickets (Tickets de Soporte)
Descripción: Registra las solicitudes de ayuda de los usuarios. 
Relación: 1:N con 'users' (Un usuario puede abrir varios tickets).
*/
CREATE TABLE [dbo].[support_tickets] (
    [ticket_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [subject] VARCHAR(255) NOT NULL,
    [status] TINYINT NOT NULL DEFAULT 1, -- 1: Abierto, 2: En Progreso, 3: Resuelto, 4: Cerrado
    [priority] TINYINT NOT NULL DEFAULT 1, -- 1: Baja, 2: Media, 3: Alta
    [created_at] DATETIME NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

/* Tabla: support_messages (Mensajes del Ticket)
Descripción: Hilo de conversación dentro de un ticket entre el usuario y el staff.
Relación: 1:N con 'support_tickets'.
*/
CREATE TABLE [dbo].[support_messages] (
    [message_id] INT IDENTITY(1,1) PRIMARY KEY,
    [ticket_id] INT NOT NULL,
    [sender_id] INT NOT NULL, -- FK a users (quien escribe el mensaje)
    [message_text] VARCHAR(MAX) NOT NULL,
    [sent_at] DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(ticket_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

-- COMMIT TRANSACTION;
-- ROLLBACK TRANSACTION;
