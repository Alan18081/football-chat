const Users = require('../models/User');
const FriendRequest = require('../helpers/FriendRequest');
const GroupMessage = require('../models/GroupMessage');

module.exports = {
  setRouting(router) {
    router.get('/groups/:name',this.groupPage);
    router.post('/groups/:roomName',this.groupPostPage);
    router.post('/groups/addFriend/:roomName',this.groupAddFriend);
    router.post('/group/rejectRequest/:roomName',this.groupRejectRequest);
    router.post('/group/:roomName/saveMessage',this.saveMessage);
  },
  async groupRejectRequest(req,res) {
    await Promise.all([
      Users.update(
        {
          _id: req.user._id,
          'request.userId': {$eq: req.body.senderId}
        },
        {
          $pull: {request: {
            userId: req.body.senderId
          }},
          totalRequest: {$inc: -1}
        }
      ),
      Users.update(
        {
          _id: req.body.senderId,
          'sentRequest.username': {$eq: req.user.username}
        },
        {
          $pull: {sentRequest: {
            userId: req.user._id
          }}
        }
      )
    ]);
    res.redirect('/')
  },
  async groupAddFriend(req,res) {
    await Promise.all([
      Users.update(
        {
          _id: req.user._id,
          'friends.friendId': {$ne: req.body.senderId}
        },
        {
          $push: {friends: {
            friendId: req.body.senderId,
            friendName: req.body.senderName
          }},
          $pull: {request: {
            userId: req.body.senderId,
            username: req.body.username
          }},
          $inc: {totalRequest: -1}
        }
      ),
      Users.update(
        {
          _id: req.body.senderId,
          'friends.friendId': {$ne: req.user._id}
        },
        {
          $push: {friends: {
            friendId: req.user._id,
            friendName: req.user.username
          }},
          $pull: {sentRequest: {
            username: req.user.username
          }}
        }
      )
    ]);
    res.redirect(`/groups/${req.params.roomName}`);
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
  async groupPostPage(req,res) {
    FriendRequest.postRequest(req,res,`/group/${req.params.name}`);
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