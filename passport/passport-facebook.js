const passport = require('passport');
const User = require('../models/User');
const config = require('../secret/secretfile');
const FacebookStrategy = require('passport-facebook').Strategy;

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

passport.use('facebook',new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  profileFields: ['email','displayName','photos'],
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  passReqToCallback: true
},async (req,token,refreshToken,profile,done) => {
  try {
    const user = await User.findOne({facebook: profile.id});
    if(user) {
      return done(null,user);
    }
    else {
      const newUser = new User({
        facebook: profile.id,
        fullname: profile.displayName,
        username: profile.displayName,
        email: profile._json.email,
        fbTokens: this.fbTokens.push({token})
      });
      await newUser.save();
      return done(null,newUser);
    }
  }
  catch(error) {
    return done(error);
  }
}));
