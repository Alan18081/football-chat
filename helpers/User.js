module.exports = {
  async signUpValidation(req,res,next) {
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('username','Username should be at least 4 characters').isLength({min: 4});
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password','Password should be at least 4 characters').isLength({min: 4});
    try {
      const result = await req.getValidationResult();
      const errors = result.array();
      const messages = [];
      errors.forEach(error => messages.push(error.msg));
      req.flash('error',messages);
      res.redirect('/signup');
    }
    catch(error) {
      next();
    }
  },
  async loginValidation(req,res,next) {
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password','Password should be at least 4 characters').isLength({min: 4});
    try {
      const result = await req.getValidationResult();
      const errors = result.array();
      const messages = [];
      errors.forEach(error => messages.push(error.msg));
      req.flash('error',messages);
      res.redirect('/login');
    }
    catch(error) {
      next();
    }
  }
};