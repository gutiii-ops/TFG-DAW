// routes/userRoutes.js
const express = require('express')
const router = express.Router()

const { authUserToken } = require('../middlewares/authMiddleware.js')
const { getUser, updateUser } = require('../controllers/userController')

// DEFINICIÓN DEL FLUJO: Ruta -> Middleware -> Controlador
router.get('/:id', authUserToken, getUser)
router.put('/:id', authUserToken, updateUser)
router.put('/perfil', authUserToken, updateUser)

module.exports = router
