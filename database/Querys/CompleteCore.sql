-- =========================================================================================
--                          MÓDULO COMPLETO: GESTIÓN DE USUARIOS, TIENDA, COACHING Y SOPORTE
-- =========================================================================================

-- MÓDULO 1: NEGOCIO Y SUSCRIPCIONES
IF OBJECT_ID('[dbo].[users]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[users] (
        [user_id] INT IDENTITY(1,1) PRIMARY KEY,
        [user_name] VARCHAR(100) NOT NULL,
        [user_surname] VARCHAR(100) NOT NULL,
        [user_phone] VARCHAR(20) NOT NULL,
        [user_email] VARCHAR(255) NOT NULL,
        [user_IdDocument] VARCHAR(20) NOT NULL,
        [user_date] DATE NOT NULL,
        [user_region] VARCHAR(100) NOT NULL,
        [password_hash] NVARCHAR(255) NOT NULL
    );
END

IF OBJECT_ID('[dbo].[plans]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[plans] (
        [plan_id] SMALLINT IDENTITY(1,1) PRIMARY KEY,
        [plan_name] VARCHAR(100) NOT NULL,
        [plan_duration] SMALLINT NOT NULL,
        [plan_price] DECIMAL(10, 2) NOT NULL,
        [plan_description] VARCHAR(MAX) NOT NULL
    );
END

IF OBJECT_ID('[dbo].[subscriptions]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[subscriptions] (
        [subscription_id] INT IDENTITY(1,1) PRIMARY KEY,
        [user_id] INT NOT NULL,
        [plan_id] SMALLINT NOT NULL,
        [start_date] DATE NOT NULL,
        [end_date] DATE NOT NULL,
        [subscription_status] BIT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (plan_id) REFERENCES plans(plan_id)
    );
END

-- MÓDULO 2: SEGURIDAD Y CONTROL DE ACCESO (RBAC)
IF OBJECT_ID('[dbo].[permissions]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[permissions] (
        [permission_id] TINYINT IDENTITY(1,1) PRIMARY KEY,
        [permission_code] TINYINT NOT NULL,
        [permission_name] VARCHAR(100) NOT NULL,
        [permission_description] VARCHAR(MAX) NOT NULL
    );
END

IF OBJECT_ID('[dbo].[roles]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[roles] (
        [role_id] SMALLINT IDENTITY(1,1) PRIMARY KEY,
        [role_name] VARCHAR(100) NOT NULL,
        [role_description] VARCHAR(MAX) NOT NULL
    );
END

IF OBJECT_ID('[dbo].[role_permissions]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[role_permissions] (
        [role_id] SMALLINT NOT NULL,
        [permission_id] TINYINT NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(role_id),
        FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
    );
END

IF OBJECT_ID('[dbo].[user_roles]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[user_roles] (
        [user_id] INT NOT NULL,
        [role_id] SMALLINT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (role_id) REFERENCES roles(role_id)
    );
END

-- MÓDULO 3: TIENDA Y GESTIÓN DE VENTAS
IF OBJECT_ID('[dbo].[products]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[products] (
        [product_id] INT IDENTITY(1,1) PRIMARY KEY,
        [product_name] VARCHAR(150) NOT NULL,
        [product_description] VARCHAR(MAX),
        [product_category] TINYINT NOT NULL,
        [product_price] DECIMAL(10, 2) NOT NULL,
        [product_image_url] VARCHAR(255)
    );
END

IF OBJECT_ID('[dbo].[orders]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[orders] (
        [order_id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [user_id] INT NOT NULL,
        [order_date] DATETIME NOT NULL,
        [total_price] DECIMAL(10, 2) NOT NULL,
        [order_code] VARCHAR(20) NOT NULL UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
END

IF OBJECT_ID('[dbo].[order_details]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[order_details] (
        [detail_id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [order_id] BIGINT NOT NULL,
        [product_id] INT NULL,
        [plan_id] SMALLINT NULL,
        [quantity] SMALLINT NOT NULL,
        [unit_price] DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        FOREIGN KEY (plan_id) REFERENCES plans(plan_id)
    );
END

-- MÓDULO 4: COACHING Y RESERVAS DE CLASES
IF OBJECT_ID('[dbo].[coaching_sessions]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[coaching_sessions] (
        [session_id] INT IDENTITY(1,1) PRIMARY KEY,
        [title] VARCHAR(150) NOT NULL,
        [description] VARCHAR(MAX),
        [instructor_name] VARCHAR(100),
        [coach_id] INT NULL,
        [day_of_week] TINYINT NOT NULL,
        [start_time] TIME NOT NULL,
        [end_time] TIME NOT NULL,
        [is_coaching] BIT DEFAULT 0,
        [category] VARCHAR(50),
        CONSTRAINT FK_coaching_sessions_coach FOREIGN KEY (coach_id) REFERENCES [dbo].[users](user_id) ON DELETE SET NULL
    );
END

IF OBJECT_ID('[dbo].[coaching_reservations]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[coaching_reservations] (
        [reservation_id] INT IDENTITY(1,1) PRIMARY KEY,
        [user_id] INT NOT NULL,
        [session_id] INT NOT NULL,
        [reservation_date] DATE NOT NULL,
        [created_at] DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (session_id) REFERENCES coaching_sessions(session_id)
    );
END

-- MÓDULO 4: ASISTENCIA TÉCNICA (SOPORTE)
IF OBJECT_ID('[dbo].[support_tickets]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[support_tickets] (
        [ticket_id] INT IDENTITY(1,1) PRIMARY KEY,
        [user_id] INT NOT NULL,
        [subject] VARCHAR(255) NOT NULL,
        [status] TINYINT NOT NULL DEFAULT 1,
        [priority] TINYINT NOT NULL DEFAULT 1,
        [created_at] DATETIME NOT NULL DEFAULT GETDATE(),
        [updated_at] DATETIME NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
END

IF OBJECT_ID('[dbo].[support_messages]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[support_messages] (
        [message_id] INT IDENTITY(1,1) PRIMARY KEY,
        [ticket_id] INT NOT NULL,
        [sender_id] INT NOT NULL,
        [message_text] VARCHAR(MAX) NOT NULL,
        [sent_at] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (ticket_id) REFERENCES support_tickets(ticket_id),
        FOREIGN KEY (sender_id) REFERENCES users(user_id)
    );
END


-- Planes
IF NOT EXISTS (SELECT 1 FROM dbo.plans WHERE plan_name = 'Basic')
    INSERT INTO dbo.plans (plan_name, plan_duration, plan_price, plan_description)
    VALUES ('Basic', 30, 29.90, 'Acceso completo a sala, zonas cardio y vestuarios.');

IF NOT EXISTS (SELECT 1 FROM dbo.plans WHERE plan_name = 'Fitness')
    INSERT INTO dbo.plans (plan_name, plan_duration, plan_price, plan_description)
    VALUES ('Fitness', 30, 49.90, 'Acceso completo + Clases dirigidas ilimitada.');

IF NOT EXISTS (SELECT 1 FROM dbo.plans WHERE plan_name = 'Premium')
    INSERT INTO dbo.plans (plan_name, plan_duration, plan_price, plan_description)
    VALUES ('Premium', 30, 89.90, 'Todo lo anterior + 1 sesión coaching/mes + Fisioterapia + Zona VIP.');

-- Roles
IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE role_name = 'User')
    INSERT INTO dbo.roles (role_name, role_description)
    VALUES ('User', 'Cliente estandar del gimnasio. Acceso a reservas, compras y membresia.');

IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE role_name = 'Coach')
    INSERT INTO dbo.roles (role_name, role_description)
    VALUES ('Coach', 'Entrenador personal. Gestiona sus propias sesiones de coaching.');

IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE role_name = 'Admin')
    INSERT INTO dbo.roles (role_name, role_description)
    VALUES ('Admin', 'Administrador con acceso total al sistema de gestion.');

-- Permisos
IF NOT EXISTS (SELECT 1 FROM dbo.permissions WHERE permission_code = 1)
    INSERT INTO dbo.permissions (permission_code, permission_name, permission_description)
    VALUES (1, 'VIEW_DASHBOARD', 'Acceder al panel de control personal');

IF NOT EXISTS (SELECT 1 FROM dbo.permissions WHERE permission_code = 2)
    INSERT INTO dbo.permissions (permission_code, permission_name, permission_description)
    VALUES (2, 'MANAGE_SESSIONS', 'Crear, editar y eliminar sesiones de coaching propias');

IF NOT EXISTS (SELECT 1 FROM dbo.permissions WHERE permission_code = 3)
    INSERT INTO dbo.permissions (permission_code, permission_name, permission_description)
    VALUES (3, 'MANAGE_USERS', 'Ver y gestionar todos los usuarios del sistema');

IF NOT EXISTS (SELECT 1 FROM dbo.permissions WHERE permission_code = 4)
    INSERT INTO dbo.permissions (permission_code, permission_name, permission_description)
    VALUES (4, 'MANAGE_INVENTORY', 'Gestionar productos e inventario de la tienda');

IF NOT EXISTS (SELECT 1 FROM dbo.permissions WHERE permission_code = 5)
    INSERT INTO dbo.permissions (permission_code, permission_name, permission_description)
    VALUES (5, 'VIEW_GLOBAL_SALES', 'Ver informes de ventas globales del gimnasio');

IF NOT EXISTS (SELECT 1 FROM dbo.permissions WHERE permission_code = 6)
    INSERT INTO dbo.permissions (permission_code, permission_name, permission_description)
    VALUES (6, 'MANAGE_PLANS', 'Crear, editar y eliminar planes de membresía');

IF NOT EXISTS (SELECT 1 FROM dbo.permissions WHERE permission_code = 7)
    INSERT INTO dbo.permissions (permission_code, permission_name, permission_description)
    VALUES (7, 'MANAGE_SUBSCRIPTIONS', 'Ver y gestionar suscripciones de todos los usuarios');

IF NOT EXISTS (SELECT 1 FROM dbo.permissions WHERE permission_code = 8)
    INSERT INTO dbo.permissions (permission_code, permission_name, permission_description)
    VALUES (8, 'MANAGE_SUPPORT', 'Ver y responder tickets de soporte técnico');

-- Role permissions
DECLARE @roleUserId SMALLINT = (SELECT role_id FROM dbo.roles WHERE role_name = 'User');
DECLARE @roleCoachId SMALLINT = (SELECT role_id FROM dbo.roles WHERE role_name = 'Coach');
DECLARE @roleAdminId SMALLINT = (SELECT role_id FROM dbo.roles WHERE role_name = 'Admin');

DECLARE @permViewDashboard TINYINT = (SELECT permission_id FROM dbo.permissions WHERE permission_code = 1);
DECLARE @permManageSessions TINYINT = (SELECT permission_id FROM dbo.permissions WHERE permission_code = 2);
DECLARE @permManageUsers TINYINT = (SELECT permission_id FROM dbo.permissions WHERE permission_code = 3);
DECLARE @permManageInventory TINYINT = (SELECT permission_id FROM dbo.permissions WHERE permission_code = 4);
DECLARE @permViewSales TINYINT = (SELECT permission_id FROM dbo.permissions WHERE permission_code = 5);
DECLARE @permManagePlans TINYINT = (SELECT permission_id FROM dbo.permissions WHERE permission_code = 6);
DECLARE @permManageSubscriptions TINYINT = (SELECT permission_id FROM dbo.permissions WHERE permission_code = 7);
DECLARE @permManageSupport TINYINT = (SELECT permission_id FROM dbo.permissions WHERE permission_code = 8);

IF @roleUserId IS NOT NULL AND @permViewDashboard IS NOT NULL
    IF NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleUserId AND permission_id = @permViewDashboard)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleUserId, @permViewDashboard);

IF @roleCoachId IS NOT NULL AND @permViewDashboard IS NOT NULL
    IF NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleCoachId AND permission_id = @permViewDashboard)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleCoachId, @permViewDashboard);

IF @roleCoachId IS NOT NULL AND @permManageSessions IS NOT NULL
    IF NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleCoachId AND permission_id = @permManageSessions)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleCoachId, @permManageSessions);

IF @roleAdminId IS NOT NULL
BEGIN
    IF @permViewDashboard IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleAdminId AND permission_id = @permViewDashboard)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleAdminId, @permViewDashboard);

    IF @permManageSessions IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleAdminId AND permission_id = @permManageSessions)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleAdminId, @permManageSessions);

    IF @permManageUsers IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleAdminId AND permission_id = @permManageUsers)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleAdminId, @permManageUsers);

    IF @permManageInventory IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleAdminId AND permission_id = @permManageInventory)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleAdminId, @permManageInventory);

    IF @permViewSales IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleAdminId AND permission_id = @permViewSales)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleAdminId, @permViewSales);

    IF @permManagePlans IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleAdminId AND permission_id = @permManagePlans)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleAdminId, @permManagePlans);

    IF @permManageSubscriptions IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleAdminId AND permission_id = @permManageSubscriptions)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleAdminId, @permManageSubscriptions);

    IF @permManageSupport IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.role_permissions WHERE role_id = @roleAdminId AND permission_id = @permManageSupport)
        INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES (@roleAdminId, @permManageSupport);
END

-- Sesiones de coaching de ejemplo
IF NOT EXISTS (SELECT 1 FROM dbo.coaching_sessions WHERE title = 'Yoga Flow' AND day_of_week = 1 AND start_time = '09:00:00')
    INSERT INTO dbo.coaching_sessions (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category)
    VALUES ('Yoga Flow', 'Clase de vinyasa yoga para todos los niveles.', 'Elena M.', 1, '09:00:00', '10:00:00', 0, 'Bienestar');

IF NOT EXISTS (SELECT 1 FROM dbo.coaching_sessions WHERE title = 'Crossfit WOD' AND day_of_week = 1 AND start_time = '18:00:00')
    INSERT INTO dbo.coaching_sessions (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category)
    VALUES ('Crossfit WOD', 'Entrenamiento del día de alta intensidad.', 'Carlos R.', 1, '18:00:00', '19:00:00', 0, 'Fuerza');

IF NOT EXISTS (SELECT 1 FROM dbo.coaching_sessions WHERE title = 'Coaching Personal' AND day_of_week = 1 AND start_time = '10:30:00')
    INSERT INTO dbo.coaching_sessions (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category)
    VALUES ('Coaching Personal', 'Sesión 1 a 1 de seguimiento y técnica.', 'Staff Gym', 1, '10:30:00', '11:30:00', 1, 'Personal');

IF NOT EXISTS (SELECT 1 FROM dbo.coaching_sessions WHERE title = 'HIIT Express' AND day_of_week = 2 AND start_time = '08:30:00')
    INSERT INTO dbo.coaching_sessions (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category)
    VALUES ('HIIT Express', '20 minutos de máxima intensidad cardiovascular.', 'Laura G.', 2, '08:30:00', '09:00:00', 0, 'Cardio');

IF NOT EXISTS (SELECT 1 FROM dbo.coaching_sessions WHERE title = 'Powerlifting' AND day_of_week = 3 AND start_time = '19:30:00')
    INSERT INTO dbo.coaching_sessions (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category)
    VALUES ('Powerlifting', 'Técnica avanzada de sentadilla y peso muerto.', 'David S.', 3, '19:30:00', '21:00:00', 0, 'Fuerza');

IF NOT EXISTS (SELECT 1 FROM dbo.coaching_sessions WHERE title = 'Pilates' AND day_of_week = 4 AND start_time = '10:00:00')
    INSERT INTO dbo.coaching_sessions (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category)
    VALUES ('Pilates', 'Control central y corrección postural.', 'Elena M.', 4, '10:00:00', '11:00:00', 0, 'Bienestar');

IF NOT EXISTS (SELECT 1 FROM dbo.coaching_sessions WHERE title = 'Coaching Personal' AND day_of_week = 5 AND start_time = '17:00:00')
    INSERT INTO dbo.coaching_sessions (title, description, instructor_name, day_of_week, start_time, end_time, is_coaching, category)
    VALUES ('Coaching Personal', 'Sesión 1 a 1 de seguimiento y técnica.', 'Staff Gym', 5, '17:00:00', '18:00:00', 1, 'Personal');