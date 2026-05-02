-- =========================================================================================
--									MÓDULO 1: NEGOCIO Y SUSCRIPCIONES
-- =========================================================================================

BEGIN TRANSACTION;

-- CONFIGURACIÓN DE SEGURIDAD PARA EL SCRIPT
SET XACT_ABORT ON; -- Si algo falla, revierte todo automáticamente

/* Tabla: users (Usuarios) */
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

/* Tabla: plans (Planes) */
CREATE TABLE [dbo].[plans] (
	[plan_id] SMALLINT IDENTITY(1,1) PRIMARY KEY,
	[plan_name] VARCHAR(100) NOT NULL,
	[plan_duration] SMALLINT NOT NULL,
	[plan_price] DECIMAL(10, 2) NOT NULL,
	[plan_description] VARCHAR(MAX) NOT NULL
);

/* Tabla: subscriptions (Suscripciones) */
CREATE TABLE [dbo].[subscriptions] (
	[subscription_id] INT IDENTITY(1,1) PRIMARY KEY,
	[user_id] INT NOT NULL,
	[plan_id] SMALLINT NOT NULL,
	[start_date] DATE NOT NULL,
	[end_date] DATE NOT NULL,
	[subscription_status] bit NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	FOREIGN KEY (plan_id) REFERENCES plans(plan_id)
);

-- =========================================================================================
--			MÓDULO 2: SEGURIDAD Y CONTROL DE ACCESO (RBAC)
-- =========================================================================================

CREATE TABLE [dbo].[permissions] (
	[permission_id] TINYINT IDENTITY(1,1) PRIMARY KEY,
	[permission_code] TINYINT NOT NULL,
	[permission_name] VARCHAR(100) NOT NULL,
	[permission_description] VARCHAR(MAX) NOT NULL
);

CREATE TABLE [dbo].[roles] (
	[role_id] SMALLINT IDENTITY(1,1) PRIMARY KEY,
	[role_name] VARCHAR(100) NOT NULL,
	[role_description] VARCHAR(MAX) NOT NULL
);

CREATE TABLE [dbo].[role_permissions] (
	[role_id] SMALLINT NOT NULL,
	[permission_id] TINYINT NOT NULL,
	PRIMARY KEY (role_id, permission_id), 
	FOREIGN KEY (role_id) REFERENCES roles(role_id),
	FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
);

CREATE TABLE [dbo].[user_roles] (
	[user_id] INT NOT NULL,
	[role_id] SMALLINT NOT NULL,
	PRIMARY KEY (user_id, role_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- =========================================================================================
-- SEMILLAS OBLIGATORIAS: LIMPIEZA AGRESIVA (TODOS LOS MÓDULOS)
-- =========================================================================================

-- 1. Limpiar tablas de tercer nivel (detalles de pedidos y reservas)
IF OBJECT_ID('[dbo].[order_details]', 'U') IS NOT NULL DELETE FROM [dbo].[order_details];
IF OBJECT_ID('[dbo].[coaching_reservations]', 'U') IS NOT NULL DELETE FROM [dbo].[coaching_reservations];

-- 2. Limpiar tablas de segundo nivel (pedidos, sesiones, suscripciones, roles)
IF OBJECT_ID('[dbo].[orders]', 'U') IS NOT NULL DELETE FROM [dbo].[orders];
IF OBJECT_ID('[dbo].[coaching_sessions]', 'U') IS NOT NULL DELETE FROM [dbo].[coaching_sessions];
DELETE FROM [dbo].[subscriptions];
DELETE FROM [dbo].[user_roles];
DELETE FROM [dbo].[role_permissions];

-- 3. Limpiar tablas maestras
DELETE FROM [dbo].[users];
DELETE FROM [dbo].[plans];
DELETE FROM [dbo].[roles];
DELETE FROM [dbo].[permissions];

-- 4. Resetear contadores de identidad
DBCC CHECKIDENT ('[dbo].[users]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[plans]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[roles]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[permissions]', RESEED, 0);
IF OBJECT_ID('[dbo].[subscriptions]', 'U') IS NOT NULL DBCC CHECKIDENT ('[dbo].[subscriptions]', RESEED, 0);

-- =========================================================================================
-- INSERCIÓN DE DATOS (SEMILLAS)
-- =========================================================================================

-- Planes
INSERT INTO [dbo].[plans] (plan_name, plan_duration, plan_price, plan_description) VALUES 
('Basic', 30, 29.90, 'Acceso completo a sala, zonas cardio y vestuarios.'),
('Fitness', 30, 49.90, 'Acceso completo + Clases dirigidas ilimitada.'),
('Premium', 30, 89.90, 'Todo lo anterior + 1 sesión coaching/mes + Fisioterapia + Zona VIP.');

-- Roles
INSERT INTO [dbo].[roles] (role_name, role_description) VALUES
('User',  'Cliente estandar del gimnasio. Acceso a reservas, compras y membresia.'),
('Coach', 'Entrenador personal. Gestiona sus propias sesiones de coaching.'),
('Admin', 'Administrador con acceso total al sistema de gestion.');

-- Permisos
INSERT INTO [dbo].[permissions] (permission_code, permission_name, permission_description) VALUES
(1, 'VIEW_DASHBOARD',       'Acceder al panel de control personal'),
(2, 'MANAGE_SESSIONS',      'Crear, editar y eliminar sesiones de coaching propias'),
(3, 'MANAGE_USERS',         'Ver y gestionar todos los usuarios del sistema'),
(4, 'MANAGE_INVENTORY',     'Gestionar productos e inventario de la tienda'),
(5, 'VIEW_GLOBAL_SALES',    'Ver informes de ventas globales del gimnasio'),
(6, 'MANAGE_PLANS',         'Crear, editar y eliminar planes de membresía'),
(7, 'MANAGE_SUBSCRIPTIONS',  'Ver y gestionar suscripciones de todos los usuarios'),
(8, 'MANAGE_SUPPORT',       'Ver y responder tickets de soporte técnico');

-- Asignacion permisos -> roles
INSERT INTO [dbo].[role_permissions] (role_id, permission_id) VALUES
(1, 1),
(2, 1), (2, 2),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8);

COMMIT TRANSACTION;
