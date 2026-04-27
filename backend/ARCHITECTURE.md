# Arquitectura del Backend de GymMgmt

¡Bienvenido al backend de **GymMgmt**!

Este proyecto aplica los principios de la **Arquitectura Orientada a Capas** (Layered Architecture) enfocada en temas técnicos. El objetivo es mantener nuestro código limpio, predecible y fácilmente adaptable para cuando introduzcamos nuestra base de datos real (Microsoft SQL Server).

A continuación explicamos cada capa según la responsabilidad que tiene y cómo viaja la información entre ellas al recibir una petición.

## 🎯 Flujo de Peticiones

Cuando una solicitud (Request) llega al servidor, sigue este ciclo de vida unidireccional:

`Rutas -> Controladores -> Servicios -> Repositorios -> (Mock/DB)`

## 🗂️ Explicación de las Capas

### 1. Capa de Rutas (`src/api/routes/`)
Define qué URLs están disponibles en la API y qué controlador debe responder.
- **Regla de oro:** Aquí no hay lógica, solo se vincula una ruta (ej. `POST /login`) a su función correspondiente del controlador.

### 2. Capa de Presentación o Controladores (`src/api/controllers/`)
Actúan como "directores de tráfico". Reciben las llamadas HTTP.
- **Responsabilidad:** Extraer la información que manda el usuario (`req.body`, `req.params`, `req.user`), pasársela a la Capa de Servicios, y devolver la respuesta con el código HTTP apropiado (`res.json`, `res.status(400)`, etc.).
- **Regla de oro:** Prohibido escribir aquí lógica de negocio, búsquedas de arrays o bcrypt. Si un servicio devuelve un error, el controlador lo convierte en error HTTP usando un `try...catch`.

### 3. Capa de Negocio o Servicios (`src/services/`)
Aquí es donde reside el "cerebro" y el valor del proyecto. 
- **Responsabilidad:** Asegurarse de que se cumplen las reglas de negocio, validar condiciones (ej. "el usuario existe", "está autorizado", "hasheo o comparación de claves"), y devolver excepciones descriptivas si algo sale mal.
- **Regla de oro:** No saben de dónde vinieron los datos (HTTP) y lanzan `throw new Error(...)` para detener procesos incorrectos, permitiendo que el controlador decida qué enviarle al cliente. Llama a los Repositorios para conseguir o modificar datos.

### 4. Capa de Infraestructura o Repositorios (`src/repositories/`)
Esta es nuestra barrera protectora frente a la base de datos o cualquier simulador de datos (`mockData.js`).
- **Responsabilidad:** Contienen las "consultas" a la base de datos (por ahora en mock). Funciones simulando asincronía (`async/await`) como `findById(id)`.
- **Regla de oro:** Es la **única ruta** válida del programa para importar de `mockData.js` o, en el futuro próximo, usar conectores a SQL Server. El Servicio no debe saber si la lista de usuarios sale de un archivo local o de una BBDD en Azure.

---

Este es el patrón mental. ¡Mantener estas separaciones estrictas evitará el "código espagueti" y nos preparará para la escalabilidad!
