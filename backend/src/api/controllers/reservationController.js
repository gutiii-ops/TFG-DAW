const coachingService = require('../../services/coachingService');

const getUserReservations = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const reservations = await coachingService.getUserBookings(userId);
    return res.json(reservations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllSessions = async (req, res) => {
  try {
    const sessions = await coachingService.getAvailableSchedule();
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId, reservationDate } = req.body;

    if (!sessionId || !reservationDate) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (sesión o fecha)' });
    }

    const result = await coachingService.makeBooking(userId, sessionId, reservationDate);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const userId = req.userId;
    const reservationId = Number(req.params.reservationId);

    const result = await coachingService.cancelBooking(reservationId, userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUserReservations,
  getAllSessions,
  createReservation,
  cancelReservation
};
