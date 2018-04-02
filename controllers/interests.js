const Users = require('../models/User');
const Messages = require('../models/Message');

const addFavItem = async (favName,req,res) => {
  try {
    await Users.update(
      {
        _id: req.user._id,
        [`${favName}.name`]: {$ne: req.body.name}
      },
      {
        $push: {
          [favName]: {
            name: req.body.name
          }
        }
      }
    );
    return res.redirect('/settings/interests');
  }
  catch(error) {
    console.log(error);
  }
};

module.exports = {
  setRouting(router) {
    router.get('/settings/interests',this.getInterestsPage);
    router.post('/settings/interests/addFavClub',this.addFavClub);
    router.post('/settings/interests/addFavPlayer',this.addFavPlayer);
    router.post('/settings/interests/addFavTeam',this.addFavTeam);
  },
  addFavPlayer(req,res) {
    addFavItem('favPlayers',req,res);
  },
  addFavClub(req,res) {
    addFavItem('favClubs',req,res);
  },
  addFavTeam(req,res) {
    addFavItem('favNationalTeams',req,res);
  },
  async getInterestsPage(req,res) {
    const [user,newMessages] = await Promise.all([
      Users.findOne({_id: req.user._id}),
      Messages.aggregate(
        [
          {
            $match: {
              $or: [{ senderName: req.user.username },{ receiverName: req.user.username }]
            }
          },
          {$sort: { createdAt: -1}}
        ]
      )
    ]);
    res.render('user/interests',{
      title: 'Your interests',
      user,
      newMessages
    });
  },
  postInterestPage(req,res) {

  }
};