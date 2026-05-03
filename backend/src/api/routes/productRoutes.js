const express = require('express')
const router = express.Router()
const { authUserToken, checkPermission } = require('../middlewares/authMiddleware')
const { getProducts } = require('../controllers/productController')

router.get('/', getProducts)

// Acciones de gestión (ejemplo)
// router.post('/', authUserToken, checkPermission('MANAGE_INVENTORY'), createProduct)
// router.put('/:id', authUserToken, checkPermission('MANAGE_INVENTORY'), updateProduct)

module.exports = router
