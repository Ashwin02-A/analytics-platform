const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { App, User } = require('../models');

exports.register = async (req, res) => {
  const { name } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const appId = crypto.randomBytes(8).toString('hex');
  const apiKey = jwt.sign({ appId }, process.env.JWT_SECRET, { expiresIn: '365d' });

  const app = await App.create({
    name, apiKey, expiresAt: new Date(Date.now() + 365 * 86400000), UserId: user.id
  });

  res.json({ apiKey: app.apiKey, appId });
};

exports.getKey = async (req, res) => {
  const app = await App.findOne({ where: { UserId: req.user.id, revoked: false } });
  if (!app) return res.status(404).json({ error: 'No active key' });
  res.json({ apiKey: app.apiKey });
};

exports.revoke = async (req, res) => {
  const app = await App.findOne({ where: { UserId: req.user.id } });
  if (!app) return res.status(404).json({ error: 'Not found' });
  app.revoked = true;
  await app.save();
  res.json({ message: 'Revoked' });
};