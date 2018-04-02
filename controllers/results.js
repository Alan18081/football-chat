const Users = require('../models/User');
const Club = require('../models/Club');

module.exports = {
  setRouting(router) {
    router.get('/results',this.getResults);
    router.post('/results',this.postResults);
    router.get('/members', this.getMembers);
    router.post('/members', this.searchMembers);
  },
  async searchMembers(req,res) {
    const regexp = new RegExp((req.body.member),'gi');
    try {
      const [users,user] = await Promise.all([
        Users.find({$or: [{country: regexp},{username: regexp}]}),
        Users.findOne({username: req.user.username})
      ]);
      res.render('members',{
        title: 'Members',
        user,
        users
      })
    }
    catch(error) {
      console.log(error);
    }
  },
  async getMembers(req,res) {
    const [user,users] = await Promise.all([
      Users.findOne({
        username: req.user.username
      }),
      Users.find({})
    ]);
    res.render('members',{
      title: 'Member',
      user,
      users
    })
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