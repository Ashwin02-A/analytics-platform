const express = require('express');
const passport = require('passport');
const { register, getKey, revoke } = require('../controllers/auth');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
);

router.post('/register', passport.authenticate('session'), register);
router.get('/api-key', passport.authenticate('session'), getKey);
router.post('/revoke', passport.authenticate('session'), revoke);

module.exports = router;