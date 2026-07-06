const express = require('express')
const router = express.Router()
const { authUserToken, checkPermission } = require('../middlewares/authMiddleware')
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')

router.get('/', getProducts)

// Acciones de gestión del inventario (protegidas para Admin con el permiso MANAGE_INVENTORY)
router.post('/', authUserToken, checkPermission('MANAGE_INVENTORY'), createProduct)
router.put('/:id', authUserToken, checkPermission('MANAGE_INVENTORY'), updateProduct)
router.delete('/:id', authUserToken, checkPermission('MANAGE_INVENTORY'), deleteProduct)

module.exports = router
