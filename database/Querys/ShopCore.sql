-- =========================================================================================
--							MÓDULO 3: TIENDA Y GESTIÓN DE VENTAS
-- =========================================================================================

/*
Este Script se debe ejecutar junto con UserCore.sql, ya que las tablas de este módulo 
dependen de la tabla 'users' para establecer relaciones de clave foránea.
*/

/* Tabla: products (Catálogo de Productos)
Descripción: Almacena todos los artículos disponibles para la venta (suplementos, ropa, etc.).
Notas: 
- 'product_category' usa TINYINT para optimizar espacio (hasta 255 categorías).
*/
CREATE TABLE [dbo].[products] (
	[product_id] INT IDENTITY(1,1) PRIMARY KEY,
	[product_name] VARCHAR(150) NOT NULL,
	[product_category] TINYINT NOT NULL, 
	[product_price] DECIMAL(10, 2) NOT NULL 
);

/* Tabla: orders (Cabecera del Pedido)
Descripción: Registra la información general de una venta (El "Ticket"). 
Relación: 1:N con 'users' (Un usuario puede realizar muchos pedidos).
Notas:
- Se usa BIGINT en 'order_id' para prevenir el agotamiento de IDs en grandes volúmenes de venta.
- 'total_price' guarda el importe final de la transacción.
*/
CREATE TABLE [dbo].[orders] (
	[order_id] BIGINT IDENTITY(1,1) PRIMARY KEY,
	[user_id] INT NOT NULL,
	[order_date] DATETIME NOT NULL,
	[total_price] DECIMAL(10, 2) NOT NULL, 
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);

/* Tabla: order_details (Detalles o Líneas del Pedido)
Descripción: Tabla puente que permite que un pedido contenga múltiples productos (Carrito).
Relación: N:M entre 'orders' y 'products'.
Notas:
- 'quantity': Cantidad de unidades de un mismo producto en el pedido.
- 'unit_price': Muy importante. Almacena el precio del producto en el momento exacto 
  de la compra, protegiendo el historial de ventas frente a futuros cambios de precio 
  en la tabla 'products'.
*/
CREATE TABLE [dbo].[order_details] (
	[detail_id] BIGINT IDENTITY(1,1) PRIMARY KEY,
	[order_id] BIGINT NOT NULL,
	[product_id] INT NOT NULL,
	[quantity] SMALLINT NOT NULL, 
	[unit_price] DECIMAL(10, 2) NOT NULL, 
	FOREIGN KEY (order_id) REFERENCES orders(order_id),
	FOREIGN KEY (product_id) REFERENCES products(product_id)
);