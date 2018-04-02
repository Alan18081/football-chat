const Users = require('../models/User');
const GroupMessage = require('../models/GroupMessage');

module.exports = {
  setRouting(router) {
    router.get('/groups/:name',this.groupPage);
    router.post('/group/:roomName/saveMessage',this.saveMessage);
  },
  async groupPage(req,res) {
    const name = req.params.name;
    try {
      const [user,groupMessages] = await Promise.all([
        Users.findOne({username: req.user.username})
          .populate('request.userId'),
        GroupMessage.find({room: name})
          .populate('sender')
          .exec()
      ]);
      res.render('groupchat/group',{
        title: name,
        groupName: name,
        user,
        groupMessages
      });
    }
    catch(error) {
      console.log('Error',error);
    }
  },
  async saveMessage(req,res) {
    const newGroupMessage = new GroupMessage({
      room: req.body.room,
      text: req.body.text,
      sender: req.user._id
    });
    await newGroupMessage.save();
    res.redirect(`/group/${req.params.roomName}`);
  }
};