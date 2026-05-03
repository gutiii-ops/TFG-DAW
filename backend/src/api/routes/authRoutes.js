const express = require('express')
const router = express.Router()
const { login, register } = require('../controllers/authController')

// Ahora las rutas son explícitas: /api/auth/login y /api/auth/register
router.post('/login', login)
router.post('/register', register)

module.exports = router
