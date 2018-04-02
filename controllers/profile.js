const path = require('path');
const fs = require('fs');
const Users = require('../models/User');
const Messages = require('../models/Message');
const formidable = require('formidable');

module.exports = {
  setRouting(router) {
    router.get('/settings/profile',this.getProfilePage);
    router.post('/uploadProfile',this.uploadProfile);

    router.get('/profile/:name',this.getOverviewPage);
    router.post('/profile/:name',this.postOverviewPage);
  },
  postOverviewPage(req,res) {

  },
  async getOverviewPage(req,res) {
    const name = decodeURIComponent(req.params.name);
    const [user,newMessages,selectedUser] = await Promise.all([
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
      ),
      Users.findOne({username: name})
    ]);
    console.log(user);
    res.render('user/overview',{
      title: req.user.username,
      user,
      newMessages,
      data: selectedUser
    });
  },
  async getProfilePage(req,res) {
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
    console.log(user);
    res.render('user/profile',{
      title: 'Your profile',
      user,
      newMessages
    });
  },
  async uploadProfile(req,res) {
    const form = new formidable.IncomingForm();
    const userInfo = await Users.findOne({_id: req.user._id});
    form.uploadDir = path.join(__dirname,'uploads/profile');
    form.on('file',(field,file) => {
      fs.renameSync(file.path,path.join(form.uploadDir,file.name));
      userInfo.userImage = file.name;
    });
    form.on('field',(name,value) => {
      userInfo[name] = value;
      console.log(name,value);
    });

    form.on('error',err => {
      if(err) console.log(err);
    });
    form.on('end',async () => {
      console.log('Info',userInfo);
      await userInfo.save();
      res.redirect('/settings/profile');
    });
    form.parse(req);
  }
};