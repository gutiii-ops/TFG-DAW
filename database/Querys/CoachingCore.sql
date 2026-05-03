-- =========================================================================================
--						MÓDULO 4: COACHING Y RESERVAS DE CLASES
-- =========================================================================================

/* 
Este módulo permite la gestión de clases grupales y sesiones de coaching.
Se integra con la tabla 'users' existente.
*/

BEGIN TRANSACTION;

/* Tabla: coaching_sessions (Horario de Actividades)
Descripción: Define las clases disponibles o los slots de coaching.
*/
CREATE TABLE [dbo].[coaching_sessions] (
    [session_id]      INT IDENTITY(1,1) PRIMARY KEY,
    [title]           VARCHAR(150) NOT NULL,
    [description]     VARCHAR(MAX),
    [instructor_name] VARCHAR(100),           -- Nombre del monitor (se rellena automáticamente desde users)
    [coach_id]        INT NULL,               -- FK al usuario coach propietario de la sesión
    [day_of_week]     TINYINT NOT NULL,       -- 1 (Lunes) a 7 (Domingo)
    [start_time]      TIME NOT NULL,
    [end_time]        TIME NOT NULL,
    [is_coaching]     BIT DEFAULT 0,          -- 0: Clase Grupal, 1: Coaching Personal
    [category]        VARCHAR(50),            -- Ej: 'Fuerza', 'Cardio', 'Bienestar'
    CONSTRAINT FK_coaching_sessions_coach
        FOREIGN KEY (coach_id) REFERENCES [dbo].[users](user_id)
        ON DELETE SET NULL
);

/* Tabla: coaching_reservations (Registro de Reservas)
Descripción: Vincula a un usuario con una sesión en una fecha específica.
*/
CREATE TABLE [dbo].[coaching_reservations] (
    [reservation_id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [session_id] INT NOT NULL,
    [reservation_date] DATE NOT NULL, -- Fecha específica de la reserva
    [created_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (session_id) REFERENCES coaching_sessions(session_id)
);

-- Datos iniciales para pruebas (Horario semanal estándar)
INSERT INTO [dbo].[coaching_sessions] (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category)
VALUES 
('Yoga Flow', 'Clase de vinyasa yoga para todos los niveles.', 'Elena M.', 1, '09:00:00', '10:00:00', 0, 'Bienestar'),
('Crossfit WOD', 'Entrenamiento del día de alta intensidad.', 'Carlos R.', 1, '18:00:00', '19:00:00', 0, 'Fuerza'),
('Coaching Personal', 'Sesión 1 a 1 de seguimiento y técnica.', 'Staff Gym', 1, '10:30:00', '11:30:00', 1, 'Personal'),
('HIIT Express', '20 minutos de máxima intensidad cardiovascular.', 'Laura G.', 2, '08:30:00', '09:00:00', 0, 'Cardio'),
('Powerlifting', 'Técnica avanzada de sentadilla y peso muerto.', 'David S.', 3, '19:30:00', '21:00:00', 0, 'Fuerza'),
('Pilates', 'Control central y corrección postural.', 'Elena M.', 4, '10:00:00', '11:00:00', 0, 'Bienestar'),
('Coaching Personal', 'Sesión 1 a 1 de seguimiento y técnica.', 'Staff Gym', 5, '17:00:00', '18:00:00', 1, 'Personal');

COMMIT TRANSACTION;
