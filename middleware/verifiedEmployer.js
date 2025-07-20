module.exports = function (req, res, next) {
  if (!req.user || !req.user.verified) {
    return res.status(403).json({ error: 'Access denied: Employer not verified' });
  }
  next();
}; 