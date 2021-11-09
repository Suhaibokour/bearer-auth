'use strict';

const { users } = require('../models/index.js');
module.exports = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; 
  users.authenticateToken(token).then(userData => {
    req.user = userData;
    next();
  }).catch(() => {
    next('Bearer token authentication error');
  });

}