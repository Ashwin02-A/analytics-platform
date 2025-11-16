const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });

  try {
    const payload = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    if (payload.revoked) throw new Error();
    req.appId = payload.appId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};