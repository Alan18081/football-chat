const Club = require('../models/Club');
const Users = require('../models/User');
const Messages = require('../models/Message');

module.exports = {
  setRouting(router) {
    router.get('/home',this.homePage);
    router.post('/home',this.postHomePage);
    router.get('/logout',this.logout);
  },
  logout(req,res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  },
  async postHomePage(req,res) {
    await Club.update(
      {
        _id: req.body.clubId,
        'fans.username': {$ne: req.user.username}
      },
      {
        $push: {fans: {
          username: req.user.username,
          email: req.user.email
        }}
      }
    );
    res.redirect('/home');
  },
  async homePage(req,res) {
    const [results,countriesObj,user,newMessages] = await Promise.all([
      Club.find({}),
      Club.aggregate([{
        $group: {
          _id: '$country'
        }
      }]),
      Users.findOne({username: req.user.username})
        .populate('request.userId'),
      Messages.aggregate(
        [{
          $match: {
            $or: [{ senderName: req.user.username },{ receiverName: req.user.username }]
          }
        },
          {$sort: { createdAt: -1}}]
      )

    ]);
    const countries = countriesObj.map(obj => obj._id);
    res.render('home',{
      title: 'Home',
      clubs: results,
      countries,
      user,
      newMessages
    });
  },
};