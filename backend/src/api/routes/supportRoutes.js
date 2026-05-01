const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.get('/', supportController.getTickets);

module.exports = router;
