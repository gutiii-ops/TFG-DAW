-- =========================================================================================
--									MÓDULO 1: NEGOCIO Y SUSCRIPCIONES
-- =========================================================================================

BEGIN TRANSACTION;

/* Tabla: users (Usuarios)
Descripción: Es el corazón de la base de datos. Guarda toda la información personal, 
de contacto y de acceso (contraseña encriptada) de cualquier persona que interactúe 
con el sistema (clientes, entrenadores, administradores).
*/
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

/* Tabla: plans (Planes)
Descripción: Catálogo de productos. Define las suscripciones que ofrece el gimnasio 
(ej. "Mensual VIP", "Anual Básico"), su duración y precio. Es una tabla catálogo.
*/
CREATE TABLE [dbo].[plans] (
	[plan_id] SMALLINT IDENTITY(1,1) PRIMARY KEY,
	[plan_name] VARCHAR(100) NOT NULL,
	[plan_duration] SMALLINT NOT NULL,
	[plan_price] DECIMAL(10, 2) NOT NULL,
	[plan_description] VARCHAR(MAX) NOT NULL
);

/* Tabla: subscriptions (Suscripciones)
Descripción: Tabla transaccional (puente) que registra el historial de compras.
Relación (N:M): Resuelve la relación de Muchos a Muchos entre 'users' y 'plans'. 
Un usuario contrata muchos planes en el tiempo, y un plan es comprado por muchos usuarios.
*/
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
--			MÓDULO 2: SEGURIDAD Y CONTROL DE ACCESO (RBAC - Role-Based Access Control)
-- =========================================================================================

/* Tabla: permissions (Permisos)
Descripción: Catálogo de acciones granulares que se pueden hacer en la app.
Ejemplos: "Crear Usuario", "Borrar Clase", "Ver Facturación".
*/
CREATE TABLE [dbo].[permissions] (
	[permission_id] TINYINT IDENTITY(1,1) PRIMARY KEY,
	[permission_code] TINYINT NOT NULL,
	[permission_name] VARCHAR(100) NOT NULL,
	[permission_description] VARCHAR(MAX) NOT NULL
);

/* Tabla: roles (Roles)
Descripción: Catálogo de perfiles o puestos genéricos dentro del sistema.
Ejemplos: "Administrador", "Entrenador", "Cliente".
*/
CREATE TABLE [dbo].[roles] (
	[role_id] SMALLINT IDENTITY(1,1) PRIMARY KEY,
	[role_name] VARCHAR(100) NOT NULL,
	[role_description] VARCHAR(MAX) NOT NULL
);

/* Tabla: role_permissions (Permisos por Rol)
Descripción: Tabla puente que define qué acciones exactas puede realizar cada rol.
Relación (N:M): Une 'roles' con 'permissions'. Si mañana un "Entrenador" pierde el permiso 
de borrar usuarios, se elimina aquí y aplica a todos los entrenadores a la vez.
Nota: Usa clave primaria compuesta para evitar asignar el mismo permiso dos veces al mismo rol.
*/
CREATE TABLE [dbo].[role_permissions] (
	[role_id] SMALLINT NOT NULL,
	[permission_id] TINYINT NOT NULL,
	PRIMARY KEY (role_id, permission_id), 
	FOREIGN KEY (role_id) REFERENCES roles(role_id),
	FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
);

/* Tabla: user_roles (Roles de Usuario)
Descripción: Tabla puente que define qué perfil(es) tiene asignado cada usuario en la app.
Relación (N:M): Une 'users' con 'roles'. Un usuario puede tener varios roles (ej. ser 
Cliente y Entrenador a la vez), y un rol agrupa a muchos usuarios.
*/
CREATE TABLE [dbo].[user_roles] (
	[user_id] INT NOT NULL,
	[role_id] SMALLINT NOT NULL,
	PRIMARY KEY (user_id, role_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- ROLLBACK TRANSACTION;
-- COMMIT TRANSACTION;