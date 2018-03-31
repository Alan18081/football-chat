const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done) => {
  done(null,user.id);
});

passport.deserializeUser(async (id,done) => {
  try {
    const user = await User.findById(id);
    done(null,user);
  }
  catch(error) {
    console.log(error);
    done(error,user);
  }
});

passport.use('local.signup',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},async (req,email,password,done) => {
  try {
    const user = await User.findOne({email});
    if(user) {
      return done(null,false);
    }
    else {
      const newUser = new User({
        username: req.body.username,
        fullname: req.body.username,
        email: req.body.email
      });
      newUser.password = newUser.encryptPassword(req.body.password);
      await newUser.save();
      console.log('Done new user');
      done(null,newUser);
    }
  }
  catch(error) {
    return done(error);
  }
}));

passport.use('local.login',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},async (req,email,password,done) => {
  try {
    const user = await User.findOne({email});
    const messages = [];
    if(!user || !user.validUserPassword(password)) {
      messages.push('Wrong combination of email and password');
      console.log(user);
      done(null,false);
    }
    return done(null,user);
  }
  catch(error) {
    return done(error);
  }
}));