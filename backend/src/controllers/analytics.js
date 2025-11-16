const { Op } = require('sequelize');
const redis = require('redis');
const { Event, App } = require('../models');

// ─────────────────────────────────────────────
// REDIS CLIENT – FIXED: Connect once, reuse
// ─────────────────────────────────────────────
let redisClient;

const getRedisClient = async () => {
  if (redisClient && redisClient.isOpen) return redisClient;

  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    socket: {
      host: '127.0.0.1',
      port: 6379,
      reconnectStrategy: (retries) => Math.min(retries * 100, 2000),
    },
  });

  redisClient.on('error', (err) => console.error('Redis Error:', err));
  redisClient.on('connect', () => console.log('Connected to Redis'));
  redisClient.on('ready', () => console.log('Redis ready'));

  await redisClient.connect();
  return redisClient;
};

// ─────────────────────────────────────────────
// CACHE HELPER – Safe, retryable
// ─────────────────────────────────────────────
const cache = async (key, ttl, fn) => {
  const client = await getRedisClient();
  try {
    const cached = await client.get(key);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.warn('Redis GET failed, falling back to DB:', err.message);
  }

  const data = await fn();

  try {
    await client.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.warn('Redis SET failed:', err.message);
  }

  return data;
};

// ─────────────────────────────────────────────
// EVENT SUMMARY
// ─────────────────────────────────────────────
exports.eventSummary = async (req, res) => {
  const { event, startDate, endDate, app_id } = req.query;

  if (!event) {
    return res.status(400).json({ error: 'event query param is required' });
  }

  const cacheKey = `analytics:summary:${event}:${startDate || ''}:${endDate || ''}:${app_id || req.user.id}`;

  try {
    const result = await cache(cacheKey, 300, async () => {
      const where = { event };

      if (startDate) where.timestamp = { [Op.gte]: new Date(startDate) };
      if (endDate) where.timestamp = { [Op.lte]: new Date(endDate) };

      // Filter by app_id OR all apps of current user
      if (app_id) {
        where.AppId = app_id;
      } else {
        const userApps = await App.findAll({
          where: { UserId: req.user.id },
          attributes: ['id'],
        });
        where.AppId = { [Op.in]: userApps.map(a => a.id) };
      }

      // Total events
      const count = await Event.count({ where });

      // Unique users by IP
      const unique = await Event.count({
        where,
        distinct: true,
        col: 'ipAddress',
      });

      // Device breakdown
      const deviceRows = await Event.findAll({
        attributes: [
          'device',
          [Event.sequelize.fn('COUNT', Event.sequelize.col('device')), 'cnt'],
        ],
        where,
        group: ['device'],
        raw: true,
      });

      const deviceData = Object.fromEntries(
        deviceRows.map(row => [row.device || 'unknown', Number(row.cnt)])
      );

      return {
        event,
        count,
        uniqueUsers: unique,
        deviceData,
        cached: false,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─────────────────────────────────────────────
// USER STATS
// ─────────────────────────────────────────────
exports.userStats = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId query param is required' });
  }

  const cacheKey = `analytics:user:${userId}`;

  try {
    const result = await cache(cacheKey, 300, async () => {
      const latestEvent = await Event.findOne({
        where: { userId },
        order: [['timestamp', 'DESC']],
        attributes: ['metadata', 'ipAddress', 'device'],
      });

      if (!latestEvent) {
        return { userId, totalEvents: 0, message: 'No events found' };
      }

      const totalEvents = await Event.count({ where: { userId } });

      return {
        userId,
        totalEvents,
        lastSeen: latestEvent.timestamp,
        ipAddress: latestEvent.ipAddress,
        device: latestEvent.device,
        deviceDetails: latestEvent.metadata || {},
        cached: false,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('User stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};