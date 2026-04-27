# GymMgmt Core Backend (Node.js/Express)

Este directorio aloja el motor del lado del servidor de la aplicación **GymMgmt**. Está construido principalmente usando **Node.js** y **Express.js**, exponiendo una API RESTful asíncrona capaz de comunicarse con una base de datos **MS SQL Server** y suministrar información persistente al ecosistema global.

---

## 🏛️ Filosofía Arquitectónica
El proyecto sigue una **Arquitectura Orientada a Capas** (Layered Architecture) estricta para garantizar la escalabilidad, la facilidad de pruebas y el desacoplamiento total de la base de datos (con soporte actual para Mocks y SQL Server).

> [!NOTE]
> Para una explicación técnica detallada sobre cómo funcionan las capas y las reglas de diseño para desarrolladores, consulta el documento: [**ARCHITECTURE.md**](./ARCHITECTURE.md).

### Capas Principales:
1.  **Capa de Presentación (Controllers):** Gestiona exclusivamente el ciclo de vida de la petición HTTP.
2.  **Capa de Negocio (Services):** Contiene las reglas, validaciones y lógica de dominio.
3.  **Capa de Datos/Infraestructura (Repositories):** Único punto de acceso a los datos (ya sean Mocks o SQL Server).

---

## 🖥️ Servicios y Tareas en Segundo Plano (Scheduler)
GymMgmt cuenta con un **Orquestador de Tareas** (`src/services/scheduler.js`) diseñado para ejecutar procesos de sincronización, limpieza y mantenimiento de forma independiente al flujo de la API.

- **Instalación como Servicio de Windows (Producción):**
  Puedes desplegar el scheduler como un servicio nativo de Windows (usando `node-windows`) ejecutando:
  ```bash
  node src/scripts/installService.js
  ```
  Esto permite que las tareas críticas se ejecuten de forma persistente incluso si el servidor API se detiene.

---

## 🪵 Registro de Eventos (Logging)
Utilizamos **Winston** para un sistema de logging robusto y dinámico.
- **Ubicación:** Los logs se generan automáticamente en la carpeta `/logs`, clasificados por tipo de componente (ej: `logs/services/authService.log`).
- **Nivel de trazabilidad:** Diferenciación entre `info` y `error`, con estampado de tiempo y modo consola colorizado para desarrollo.

---

## 🛠 Tecnología y Stack Usado

- **Framework:** `express` (v5.2+).
- **Base de Datos:** `mssql` (v12.x+) para Microsoft SQL Server.
- **Seguridad:** `bcrypt` para hashing algorítmico y `cors` para comunicaciones seguras.
- **Configuración:** `dotenv` para gestión de secretos y variables de entorno.
- **Logging:** `winston` para trazabilidad profesional.

---

## 📂 Organización de carpetas (`src/`)

```plaintext
/backend/src/
 ├── /api            # Rutas, controladores y middlewares (Presentación).
 ├── /services       # Lógica de negocio y orquestación de tareas (Negocio).
 ├── /repositories   # Abstracción y acceso a datos (Datos).
 ├── /utils          # Utilidades globales (Logger, Helpers).
 ├── /scripts        # Scripts de utilidad (Instalación de servicio, Generación de usuarios).
 ├── /models         # Esquemas de datos y clases de dominio.
 └── main.js         # Punto de entrada maestro de la API (Puerto 8000).
```

## 🚀 Guía de Inicio Rápido
1. Asegúrate de tener configurado tu archivo `.env` en la raíz (basado en `.env.example`).
2. Instala las dependencias: `npm install`.
3. Iniciar API en desarrollo: `npm run dev`.
4. Iniciar Scheduler en consola: `node src/services/scheduler.js`.

---
© 2026 GymMgmt Development Team - TFG DAW