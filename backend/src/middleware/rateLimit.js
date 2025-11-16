const rateLimit = require('express-rate-limit');

module.exports = {
  collect: rateLimit({ windowMs: 60_000, max: 100, message: 'Too many events' }),
  analytics: rateLimit({ windowMs: 60_000, max: 50, message: 'Too many requests' }),
};