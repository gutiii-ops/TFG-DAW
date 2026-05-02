# GymMgmt Enterprise Solution

GymMgmt es una plataforma integral de gestión para centros deportivos de alto rendimiento. El sistema ha sido diseñado bajo estándares de arquitectura empresarial, garantizando una separación clara de responsabilidades, seguridad de grado bancario y una experiencia de usuario optimizada para la productividad administrativa y el compromiso del cliente.

## Pilares de la Solución

La arquitectura de GymMgmt se asienta sobre tres ejes fundamentales que garantizan su estabilidad y escalabilidad:

1.  **Arquitectura en Capas (Backend)**: Implementación de un flujo desacoplado mediante Controladores, Servicios y Repositorios.
2.  **Interfaz de Alto Impacto (Frontend)**: Experiencia de usuario Single Page Application (SPA) con un sistema de diseño orientado al rendimiento.
3.  **Modelo de Datos Relacional (Database)**: Esquema robusto en SQL Server con integridad referencial estricta y control de acceso basado en roles (RBAC).

---

## Especificaciones de la Interfaz (Frontend)

El frontend ha sido desarrollado sobre React 18 y Vite, priorizando la velocidad de carga y la interactividad fluida.

### Componentes del Ecosistema
*   **Sistema de Diseño**: Estética Dark Mode con implementación de Glassmorphism y micro-interacciones asíncronas.
*   **Gestión de Estado**: Uso de Context API para la persistencia de seguridad y preferencias de usuario a nivel global.
*   **Dashboard Dinámico**: Panel inteligente que adapta su interfaz y capacidades en tiempo real según el rol detectado (Administrador, Entrenador o Cliente).
*   **Inbox Administration**: Módulo de soporte técnico avanzado con gestión de hilos de conversación asíncronos y estados de resolución.

---

## Núcleo Lógico y Seguridad (Backend)

El motor de la aplicación reside en un entorno Node.js, actuando como orquestador entre la interfaz y la capa de datos.

### Características Técnicas
*   **Seguridad RBAC**: Control de acceso granular que valida permisos específicos por cada endpoint mediante interceptores de JWT.
*   **Procesamiento Asíncrono**: Arquitectura orientada a eventos que garantiza que la lógica de negocio no bloquee la disponibilidad de la API.
*   **Planificador de Tareas**: Sistema interno de monitorización y mantenimiento que ejecuta procesos secundarios de integridad y disponibilidad de servicios.
*   **Criptografía**: Implementación de algoritmos de hashing Bcrypt para la protección de datos sensibles y credenciales.

---

## Infraestructura de Datos (SQL Server)

El modelo de datos ha sido diseñado para soportar operaciones transaccionales complejas con una mínima latencia.

### Estructura de Módulos
*   **Security Core**: Gestión de identidades, roles y el catálogo maestro de permisos del sistema.
*   **Commerce & Inventory**: Control de existencias, flujos de ventas globales y gestión de membresías recurrentes.
*   **Coaching System**: Motor de reservas y gestión de agendas para entrenadores personales con validación de conflictos horarios.
*   **Support Engine**: Persistencia de comunicaciones y trazabilidad de incidencias de usuario.

---

## Estructura del Proyecto

```text
GymMgmt/
├── backend/            # Lógica de servidor, API REST y Servicios de Negocio
├── frontend/           # Interfaz de usuario, Gestión de Estado y Diseño
├── database/           # Scripts de definición de esquema e Integridad de Datos
└── README.md           # Documentación maestra del sistema
```

---

## Guía de Instalación y Despliegue

### Requisitos Previos
*   Node.js v18 o superior.
*   Microsoft SQL Server 2019+.
*   Gestor de paquetes npm.

### Procedimiento de Configuración
1.  **Base de Datos**: Ejecutar los scripts de inicialización ubicados en `/database/Querys` respetando el orden de integridad referencial (User -> Shop -> Coaching -> Support).
2.  **Servidor**: Acceder al directorio `/backend`, configurar las variables de entorno en el archivo `.env` y ejecutar el comando de instalación de dependencias.
3.  **Cliente**: Acceder al directorio `/frontend`, instalar las dependencias y ejecutar el entorno de desarrollo mediante el comando configurado en Vite.

---

## Conclusión

GymMgmt representa una solución técnica de vanguardia para la digitalización de centros deportivos, combinando una infraestructura de datos sólida con una capa de presentación moderna y eficiente. El sistema está preparado para su despliegue en entornos de producción que requieran alta disponibilidad y seguridad en la gestión de información sensible.

*Proyecto de Desarrollo de Aplicaciones Web - TFG-DAW - 2026*
