const express = require('express')
const router = express.Router()
const { authUserToken } = require('../middlewares/authMiddleware')
const {
  getUserOrders,
  getOrderById
} = require('../controllers/orderController')

router.get('/user/:userId', authUserToken, getUserOrders)
router.get('/:orderId', authUserToken, getOrderById)

module.exports = router
