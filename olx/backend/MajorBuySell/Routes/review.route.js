const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const { createReview } = require('../Controllers/review.controller');

// POST /api/reviews - Create a new review
router.post('/', auth, createReview);

module.exports = router;