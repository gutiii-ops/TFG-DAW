const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.get('/', subscriptionController.getSubscriptions);

module.exports = router;
