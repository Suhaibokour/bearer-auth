'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SECRET = process.env.SECRET || 'stuff';

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('Users', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {type: DataTypes.VIRTUAL  }
  });

  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
    console.log(user.password);
  });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({where: { username }})
 
    const valid = await bcrypt.compare(password, user.password)
   
    if (valid) {

      let newToken = jwt.sign({ username: user.username },SECRET);
      user.token = newToken;
    return user;
    }
    else{throw new Error('Invalid User')}
  }

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token,SECRET);

      const user = await this.findOne({where:{ username: parsedToken.username}})
   
      if (user.username) { 
        
      return user; }
    else { throw new Error("User Not Found");}
    } catch (e) {
      throw new Error(e.message)
    }
  }

  return model;
}

module.exports = userSchema;