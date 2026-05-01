const express = require('express')
const router = express.Router()
const { authUserToken } = require('../middlewares/authMiddleware')
const {
  getUserOrders,
  getOrderById,
  createOrder
} = require('../controllers/orderController')

router.get('/user/:userId', authUserToken, getUserOrders)
router.get('/:orderId', authUserToken, getOrderById)
router.post('/', authUserToken, createOrder)

module.exports = router
