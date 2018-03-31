const Users = require('../models/User');
const Club = require('../models/Club');

module.exports = {
  setRouting(router) {
    router.get('/results',this.getResults);
    router.post('/results',this.postResults);
  },
  getResults(req,res) {
    res.redirect('/home');
  },
  async postResults(req,res) {
    const regexp = new RegExp((req.body.country),'gi');
    try {
      const [clubs,user,countriesObj] = await Promise.all([
        Club.find({$or: [{country: regexp},{club: regexp}]}),
        Users.findOne({username: req.user.username}),
        Club.aggregate([{
          $group: {
            _id: '$country'
          }
        }])
      ]);
      const countries = countriesObj.map(obj => obj._id);
      res.render('results',{
        title: 'Results',
        user,
        clubs,
        countries
      })
    }
    catch(error) {
      console.log(error);
    }
  }
};