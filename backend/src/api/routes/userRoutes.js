// routes/userRoutes.js
const express = require('express')
const router = express.Router()

const { authUserToken, checkPermission } = require('../middlewares/authMiddleware.js')
const { getUser, updateUser, getAllUsers, updateRole } = require('../controllers/userController')

// DEFINICIÓN DEL FLUJO: Ruta -> Middleware -> Controlador
router.get('/', authUserToken, checkPermission('MANAGE_USERS'), getAllUsers)
router.put('/role', authUserToken, checkPermission('MANAGE_USERS'), updateRole)
router.get('/:id', authUserToken, getUser)
router.put('/:id', authUserToken, updateUser)
router.put('/perfil', authUserToken, updateUser)

module.exports = router
