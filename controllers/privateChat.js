const Messages = require('../models/Message');
const Users = require('../models/User');

module.exports = {
  setRouting(router) {
    router.get('/chat/:name',this.getChatPage);
    router.post('/chat/:name',this.postChatPage);
  },
  async getChatPage(req,res) {
    try {
      const [user,messages,newMessages] = await Promise.all([
        Users.findOne({username: req.user.username})
          .populate('request.userId')
          .exec(),
        Messages.find({$or: [
          {
            senderName: req.user.username
          },
          {
            receiverName: req.user.username
          }
        ]})
          .populate('sender')
          .populate('receiver')
          .exec(),
        Messages.aggregate(
          [{
            $match: {
              $or: [{ senderName: req.user.username },{ receiverName: req.user.username }]
            }
          },
          {$sort: { createdAt: -1}}]
        )
      ]);
      res.render('private/privateChat',{
        title: 'Private chat',
        user,
        newMessages,
        messages
      })
    }
    catch (error) {
      console.log(error);
    }
  },
  async postChatPage(req,res) {
    const params = req.params.name.split('.');
    const receiverName = params[0];
    try {
      if(req.body.message) {
        const receiver = await Users.findOne({
          username: receiverName
        });
        const newMessage = new Messages({
          sender: req.user._id,
          receiver: receiver._id,
          senderName: req.user.username,
          receiverName: receiver.username,
          message: req.body.message,
          senderImage: req.user.userImage,
          createdAt: new Date()
        });
        await newMessage.save();
        if(req.body.chatId) {
          await Messages.update(
            {
              _id: req.body.chatId
            },
            {
              isRead: true
            }
          )
        }
        res.redirect('/chat/' + req.params.name);
      }
    }
    catch(error) {
      console.log(error);
    }
  }
};