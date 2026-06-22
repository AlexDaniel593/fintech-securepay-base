const jwt = require('jsonwebtoken');
const fs = require('fs');
const env = require('../config/env');

/**
 * Genera un Token JWT firmado con clave privada asimétrica (RS256).
 * Payload con claims seguros: sub, name y exp (2 minutos).
 *
 * @param {Object} user - Objeto con la información del usuario a firmar.
 * @returns {string} JWT Token firmado.
 */
function signToken(user) {
  const privateKey = fs.readFileSync(env.privateKeyPath, 'utf8');

  const payload = {
    sub: user.id || user.sub,
    name: user.name || user.email || user.sub
  };

  return jwt.sign(payload, privateKey, { algorithm: env.jwtAlgorithm, expiresIn: '2m' });
}

/**
 * Verifica un Token JWT utilizando la clave pública asimétrica (RS256).
 *
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Payload decodificado si es válido.
 */
function verifyToken(token) {
  const publicKey = fs.readFileSync(env.publicKeyPath, 'utf8');
  return jwt.verify(token, publicKey, { algorithms: [env.jwtAlgorithm] });
}

module.exports = {
  signToken,
  verifyToken
};
