const passport = require('passport');
const User = require('../helpers/User');

module.exports = {
  setRouting(router) {
    router.get('/',this.indexPage);
    router.get('/signup', this.getSignUp);
    router.get('/home',this.homePage);
    router.post('/signup',User.signUpValidation,this.postSignUp);
    router.post('/login',User.loginValidation,this.postLogin);
    router.get('/login',this.getLogin);
  },
  homePage(req,res) {
    res.render('home');
  },
  indexPage(req,res){
    res.render('index',{
      test: 'New title'
    });
  },
  getSignUp(req,res){
    const errors = req.flash('error');
    res.render('signup',{
      messages: errors,
      hasErrors: !!errors.length
    });
  },
  getLogin(req,res) {
    const errors = req.flash('error');
    res.render('login',{
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
  })
};