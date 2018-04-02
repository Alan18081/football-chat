const Users = require('../models/User');

module.exports = {
  setRouting(router) {
    router.post('/sendFriendReq',this.sendFriendRequest);
    router.post('/acceptFriendReq',this.acceptFriendReq);
    router.post('/rejectFriendReq',this.rejectFriendReq);
  },
  async rejectFriendReq(req,res) {
    try {
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
      res.sendStatus(200);
    }
    catch(error) {
      console.log(error);
    }
  },
  async acceptFriendReq(req,res) {
    console.log('Accept friend req');
    try {
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
      res.sendStatus(200);
    }
    catch(error) {
      console.log(error);
    }
  },
  async sendFriendRequest(req,res) {
    try {
      await Promise.all([
        Users.update(
          {
            username: req.body.receiver,
            'request.id': {$ne: req.user._id},
            'friends.friendId': {$ne: req.user._id}
          }, {
            $push: {
              request: {
                userId: req.user._id,
                username: req.user.username
              }
            },
            $inc: {
              totalRequest: 1
            }
          }
        ),
        Users.update(
          {
            username: req.user.username,
            'sentRequest.username': {$ne: req.body.receiver}
          },
          {
            $push: {
              sentRequest: {
                username: req.body.receiver
              }
            }
          }
        )
      ]);
      res.sendStatus(200);
    }
    catch(error) {
      console.log(error);
    }
  }
};