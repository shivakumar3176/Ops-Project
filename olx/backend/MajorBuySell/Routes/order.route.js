const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const { createOrder } = require('../Controllers/order.controller');

// POST /api/orders - Create a new order request
router.post('/', auth, createOrder);

module.exports = router;