const Users = require('../models/User');

module.exports = {
  async postRequest(req,res,url) {
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
      res.redirect(url);
    }
    catch(error) {
      console.log(error);
    }
  }
};