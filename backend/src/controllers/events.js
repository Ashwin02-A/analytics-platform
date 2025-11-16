const { Event } = require('../models');

exports.collect = async (req, res) => {
  const { event, url, referrer, device, ipAddress, timestamp, metadata, userId } = req.body;
  if (!event || !ipAddress) return res.status(400).json({ error: 'event & ipAddress required' });

  await Event.create({
    event, url, referrer, device, ipAddress,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    metadata, userId, AppId: req.appId
  });

  res.status(201).json({ message: 'Event collected' });
};