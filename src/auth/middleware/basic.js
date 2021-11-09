'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js')

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ')[1];
  let [username, password] = base64.decode(basic).split(':');
  
  users.authenticateBasic(username, password).then(validUser => {
    req.user = validUser;
    next();
  })
  .catch(err => { next('Invalid Login') })
  


}