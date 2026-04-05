# Core Backend (Node.js/Express) - GymMgmt 🚀

Este directorio aloja toda la lógica del lado del servidor de la aplicación **GymMgmt**. Está construido principalmente usando **Node.js** y **Express.js**, exponiendo una API RESTful completamente asíncrona capaz de comunicarse con una base de datos **MS SQL Server** y suministrar información persistente a la aplicación React (`frontend`).

---

## 🛠 Tecnología y Stack Usado

La arquitectura del ecosistema Node se conforma en base a una estricta modularidad orientada a controladores (`MVC-like`), usando las siguientes dependencias vitales:

### 1. `express` (v5.2+)
Es el **Framework principal** sobre el que corre nuestro servidor web. Lo usamos porque es altamente ligero y minimalista, permitiéndonos crear una API en escasos minutos mediante la asiganción de manejadores de rutas (routers).

### 2. `mssql`
El driver oficial para permitir la lectura y escritura del servidor en bases de datos **Microsoft SQL Server**. Se configura mediante promesas y pools de conexión para mantener un flujo de datos asíncrono no-bloqueante y eficiente.

### 3. `cors`
Módulo de seguridad (**Cross-Origin Resource Sharing**). Como React (frontend) y Express (backend) se ejecutan en puertos distintos localmente, los navegadores por defecto bloquean sus comunicaciones cruzadas por medidas de seguridad. Este middleware rebaja esas barreras explícitamente para peticiones de confianza.

### 4. `dotenv`
Gestor seguro de secretos. Lee un archivo oculto llamado literalmente `.env` (que jamás se sube a los repositorios públicos) donde viven contraseñas de bases de datos, tokens de facturación, o puertos secretos, y los expone como `process.env.*`.

### 5. `bcrypt`
Módulo de ciberseguridad crítico diseñado para el **Hashing algorítmico**. Su función exclusiva es coger las contraseñas planas de los usuarios registrados (ej. *'Hola123'*) y aplicarles funciones exponenciales hiper-complejas matemáticas antes de guardarse en el disco duro de la base de datos SQL (ej. *'$2b$10$wI5kXjU/dExsO...'*), mitigando cualquier fuga de seguridad incluso si la base de datos se corrompe.

### 6. C/C++ Addons (`cpp_addons/`)
Se ha configurado y detectado un esqueleto base optimizado de **código nativo (C++ compilado estáticamente)** a través del ecosistema de compatibilidad de Node (`N-API`). Esta sección está diseñada para escenarios de carga computacional absurdos donde Javascript es demasiado lento, por ende el procesamiento se migra temporalmente al procesador compilado en base binaria de C++ para cálculos intensivos (Machine Learning, algoritmos genéticos pesados...).

---

## 📁 Arquitectura Mapeada del Código (`src/`)

```plaintext
/backend/src/
 ├── /api
 │    ├── /routes        # (Los Puntos de Entrada REST: Define la URL (ej. /login), el método HTTP (ej. POST) y envía la bola al Controlador)
 │    ├── /controllers   # (Cerebro Lógico: Extraje las IDs, validan que los roles sean correctos y mandan la petición de datos).
 │    ├── /middlewares   # (Guardias de Seguridad: Código que se ejecuta a *mitad de camino*, validando Tokens JWT para ver si el usuario es VIP).
 ├── /config             # Configuraciones pesadas (Iniciadores de la base de datos mssql)
 ├── /services           # Logica pura y cruda (Las interacciones SQL puras como 'SELECT * FROM...', totalmente separadas del router).
 ├── main.js             # ORQUESTADOR MAESTRO. Junta absolutamente todo e inicializa el agujero negro de eventos de Node en el PUERTO 8000.
```

## 💻 Instrucciones de Arranque para Desarrollo
1. Situarse en la carpeta raíz `/backend`.
2. Renombrar o configurar un archivo `.env` en la raíz copiando las credenciales secretas compartidas del equipo (SQL User y Contraseñas).
3. Lanzar:
   ```bash
   npm install
   npm run dev
   ```
*(Usamos `npm run dev` para que el `nodemon` vigile los archivos y si cambias 1 línea de código en caliente, tu backend se auto-reinicie como por arte de magia ✨).*
