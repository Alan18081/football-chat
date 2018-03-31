const passport = require('passport');
const User = require('../models/User');
const config = require('../secret/secretfile');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

passport.use('google',new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: 'http://localhost:3000/auth/google/callback',
  passReqToCallback: true
},async (req,accessToken,refreshToken,profile,done) => {
  try {
    const user = await User.findOne({google: profile.id});
    if(user) {
      console.log(user);
      return done(null,user);
    }
    else {
      const newUser = new User({
        username: profile.displayName,
        google: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        userImage: profile._json.image.url
      });
      newUser.fbTokens.push({accessToken});
      await newUser.save();
      return done(null,newUser);
    }
  }
  catch(error) {
    return done(error);
  }
}));
