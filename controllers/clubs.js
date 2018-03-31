const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

const Club = require('../models/Club');
const Users = require('../models/User');

module.exports = {
  setRouting(router) {
    router.get('/dashboard',this.adminPage);
    router.post('/uploadFile',this.uploadFile);
  },
  async adminPage(req,res) {
    const [user] = await Promise.all([
      Users.findOne({username: req.user.username})
        .populate('request.userId')
    ]);
    res.render('admin/dashboard',{
      title: 'New club',
      user
    });
  },
  uploadFile(req,res) {
    const newClub = new Club();
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname,'../public/uploads');
    form.on('file',(field,file) => {
      fs.renameSync(file.path,path.join(form.uploadDir,file.name));
      newClub.image = file.name;
    });
    form.on('field',(name,value) => {
      console.log('Field');
      newClub[name] = value;
    });

    form.on('error',err => {
      if(err) console.log(err);
    });

    form.on('end',async () => {
      console.log(newClub);
      await newClub.save();
      console.log('File upload is successful');
    });

    form.parse(req);
  }
};