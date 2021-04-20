const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401)

  const { secret } = config.token.access;
  jwt.verify(token, secret, (err, user) => {
    if (err) {
        console.error(err);
        return res.status(403).send({ message: 'Unauthenticated' });
    }

    req.user = user;

    next();
  });
}

module.exports = authenticateToken;