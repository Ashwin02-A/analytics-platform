const express = require('express');
const { eventSummary, userStats } = require('../controllers/analytics');
const { analytics: limiter } = require('../middleware/rateLimit');

const router = express.Router();
router.get('/event-summary', limiter, eventSummary);
router.get('/user-stats', limiter, userStats);
module.exports = router;