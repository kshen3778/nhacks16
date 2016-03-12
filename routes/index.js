var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var jwt = require('express-jwt');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

//middleware for authenticating jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


//passport register route
router.post('/register', function(req, res, next){
   if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'Please fill out all fields'});
   }
   
   var user = new User();
   
   user.username = req.body.username;
   user.setPassword(req.body.password);
   
   user.save(function(err){
      if(err){
         return next(err);
      }
      //if registration is successful then return a JWT token to client
      return res.json({token: user.generateJWT()});
   });
   
});

//passport login route
router.post('/login', function(req,res,next){
   if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'please fill out all fields'});
   }
   
   passport.authenticate('local', function(err, user, info){
      if(err){
         return next(err);
      }
      if(user){
         //if authentication is successful return a JWT token to client
         return res.json({token: user.generateJWT()});
      } else{
         return res.status(401).json(info);
      }
   })(req,res,next);
});

module.exports = router;

