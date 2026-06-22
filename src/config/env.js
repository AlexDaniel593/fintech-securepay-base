require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  sentryDsn: process.env.SENTRY_DSN,
  jwtAlgorithm: process.env.JWT_ALGORITHM || 'RS256',
  privateKeyPath: process.env.PRIVATE_KEY_PATH
    ? path.resolve(process.env.PRIVATE_KEY_PATH)
    : path.join(__dirname, '../../private.pem'),
  publicKeyPath: process.env.PUBLIC_KEY_PATH
    ? path.resolve(process.env.PUBLIC_KEY_PATH)
    : path.join(__dirname, '../../public.pem')
};
