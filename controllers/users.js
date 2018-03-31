const passport = require('passport');
const User = require('../helpers/User');
const Users = require('../models/User');

module.exports = {
  setRouting(router) {
    router.get('/',this.indexPage);

    router.get('/signup', this.getSignUp);
    router.post('/signup',User.signUpValidation,this.postSignUp);

    router.post('/login',User.loginValidation,this.postLogin);
    router.get('/login',this.getLogin);

    router.get('/auth/facebook',this.getFacebookLogin);
    router.get('/auth/facebook/callback',this.getFacebookCallback);

    router.get('/auth/google',this.getGoogleLogin);
    router.get('/auth/google/callback',this.getGoogleCallback);
  },
  async indexPage(req,res){
    res.render('index',{
      title: 'Main page'
    });
  },
  getSignUp(req,res){
    const errors = req.flash('error');
    res.render('signup',{
      title: 'Registration',
      messages: errors,
      hasErrors: !!errors.length
    });
  },
  async getLogin(req,res) {
    const errors = req.flash('error');
    res.render('login',{
      title: 'Authentification',
      messages: errors,
      hasErrors: !!errors.length
    });
  },
  postSignUp: passport.authenticate('local.signup',{
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  }),
  postLogin: passport.authenticate('local.login',{
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }),
  getFacebookLogin: passport.authenticate('facebook',{
    scope: 'email'
  }),
  getFacebookCallback: passport.authenticate('facebook',{
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  }),
  getGoogleLogin: passport.authenticate('google',{
    scope: ['profile','email']
  }),
  getGoogleCallback: passport.authenticate('google',{
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  })
};