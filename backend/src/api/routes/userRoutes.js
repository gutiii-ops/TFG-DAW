// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Importamos el guardia (middleware) y el cocinero (controlador)
const { authUserToken } = require('../middlewares/authMiddleware.js');
const { updateUser } = require('../controllers/userController');

// DEFINICIÓN DEL FLUJO: Ruta -> Middleware -> Controlador
router.put('/perfil', authUserToken, updateUser);

module.exports = router;