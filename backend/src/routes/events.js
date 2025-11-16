const express = require('express');
const { collect } = require('../controllers/events');
const auth = require('../middleware/auth');
const { collect: limiter } = require('../middleware/rateLimit');

const router = express.Router();
router.post('/collect', limiter, auth, collect);
module.exports = router;