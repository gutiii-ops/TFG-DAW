# GymMgmt

## Resumen
Una App Web destinada a los gimnasios para eliminar el uso de múltiples empresas externas que gestionen como servicios web la página oficial, las reservas del propio gimnasio y la posibilidad de una tienda para el propio dueño.
Con nuestra aplicación los gimnasios dispondrán de la libertad y comodidad de tener todo en un solo lugar.

Así dispondrán de las siguientes accesibilidades en base al rol:

### Administradores (Gimnasios):
- **Gestión de Servicios:** Administrar y configurar la oferta de servicios disponibles para los usuarios.
- **Gestión de Suscripciones:** Controlar las altas, bajas y el estado de las membresías de los usuarios.
- **Soporte Técnico:** Disponer de un portal de asistencia para la resolución de problemas o consultas.

### Coaches:
- **Calendario de clases:** Un calendario donde pueden ver cuánta gente y qué clase toca en cada momento.
- **Asistencias privadas:** Chats privados donde puedan resolver dudas a usuarios y dar la posibilidad de agendar una sesión privada con cada usuario.

### Usuarios:
- **Información de Cuenta:** Visualizar los servicios y suscripciones contratadas y el acceso asociado a ellas.
- **Calendario:** Acceder a un calendario para la reserva de clases, eventos o seguimiento de rutinas.
- **Estadísticas de Entrenamiento:** Consultar y hacer seguimiento de las métricas y datos registrados durante el uso del gimnasio (ej. progreso, asistencias, etc.).

## Tipo de App
- **Sistema Completo.**
- **Tecnologías:**
  - **Front:** HTML, CSS y React (JS).
  - **Back:** Microsoft SQL Server, Node.js, C++.
  - **Hosting:** En caso de extenderse utilizaremos AWS para el hosting.

## Datos
- **Flujo:** API, BBDD propia y carga manual.
- **Formato:** JSON.

## Estructura del Repositorio

El proyecto está dividido en los siguientes módulos o directorios principales:

- **`frontend/`**: Aplicación web del lado del cliente, construida con React (usando Vite). Contiene toda la interfaz de usuario, componentes y assets públicos.
- **`backend/`**: Servidor desarrollado en Node.js para implementar la API REST. Gestionará la lógica de negocio y las peticiones enviadas desde el cliente.
- **`database/`**: Contiene scripts y archivos relacionados con la definición, creación y poblado de la base de datos corporativa (Microsoft SQL Server).
- **`docs/`**: Documentación adicional del proyecto. Actualmente incluye diagramas y modelos relacionales de la base de datos de GymMgmt en formato visual e imprimible (PNG, PDF).
