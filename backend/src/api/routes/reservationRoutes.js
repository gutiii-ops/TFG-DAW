const express = require('express')
const router = express.Router()
const { authUserToken } = require('../middlewares/authMiddleware')
const {
  getUserReservations,
  createReservation,
  cancelReservation
} = require('../controllers/reservationController')

router.get('/user/:userId', authUserToken, getUserReservations)
router.post('/', authUserToken, createReservation)
router.delete('/:reservationId', authUserToken, cancelReservation)

module.exports = router
