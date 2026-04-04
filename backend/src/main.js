/* ==================================================================
                            main.js
              Punto de entrada del backend (orquestador)
   ================================================================== */

const express = require('express');
const app = express();

// 1. Importamos el archivo de rutas
const userRoutes = require('./api/routes/userRoutes');

// Importante para leer el JSON que envías desde React
app.use(express.json());

// 2. ENCHUFAMOS LAS RUTAS (Aquí está la magia)
// Le decimos: "Todo lo que empiece por /api/users, gestiónalo con userRoutes"
app.use('/api/users', userRoutes);

app.listen(8000, () => {
    console.log('Servidor corriendo en puerto 8000');
});