/* ==================================================================
                            main.js
              Punto de entrada del backend (orquestador)
   ================================================================== */

// Carga de dependencias
const express = require('express')
const cors = require('cors')
const path = require('path')

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '/config/.env') });

const app = express()

// ── MIDDLEWARES GLOBALES ──
// Importante para leer el JSON que envías desde React
app.use(express.json())

// Habilitar CORS para permitir peticiones del cliente (React usualmente en 5173 o 3000)
app.use(cors())

// 1. Importamos los archivos de rutas
const authRoutes = require('./api/routes/authRoutes')
const userRoutes = require('./api/routes/userRoutes')
const productRoutes = require('./api/routes/productRoutes')
const orderRoutes = require('./api/routes/orderRoutes')
const reservationRoutes = require('./api/routes/reservationRoutes')
const supportRoutes = require('./api/routes/supportRoutes')
const subscriptionRoutes = require('./api/routes/subscriptionRoutes')
const planRoutes = require('./api/routes/planRoutes')
const coachRoutes = require('./api/routes/coachRoutes')

// 2. ENCHUFAMOS LAS RUTAS (Aquí está la magia)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/coach/sessions', coachRoutes)

// 3. MIDDLEWARE: MANEJADOR DE RUTAS INEXISTENTES (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// 4. MIDDLEWARE: GLOBAL ERROR HANDLER
// Atrapa de forma centralizada cualquier throw o excepción no gestionada de los endpoints
app.use((err, req, res, next) => {
  console.error('[Error Crítico Servidor]:', err.stack || err.message)
  res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor' })
})

// 5. INICIAR EL SERVIDOR
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`)
})
