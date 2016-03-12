var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
   username: {type: String, lowercase: true, unique: true},
   //password hash and salt
   hash: String,
   salt: String
});

//set user's password
UserSchema.methods.setPassword = function(password){
  //generate salt for password
  this.salt = crypto.randomBytes(16).toString('hex');
  //generate hash for password
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

//checks for correct password
UserSchema.methods.validPassword = function(password){
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  
  return this.hash === hash; //return true if the hash matched the salt
};

UserSchema.methods.generateJWT = function(){
  //set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  
  return jwt.sign({
      _id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

mongoose.model('User', UserSchema);