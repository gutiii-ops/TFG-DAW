const getUserReservations = (req, res) => {
  return res.json([])
}

const createReservation = (req, res) => {
  return res
    .status(201)
    .json({ message: 'Reserva creada', reservation_id: Date.now() })
}

const cancelReservation = (req, res) => {
  return res.json({ message: 'Reserva cancelada' })
}

module.exports = {
  getUserReservations,
  createReservation,
  cancelReservation
}
