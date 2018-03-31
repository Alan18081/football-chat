const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, unique: true,default: ''},
  fullname: {type: String, unique: true, default: ''},
  email: {type: String, unique: true},
  password: {type: String, default: ''},
  userImage: {type: String, default: 'default.png'},
  facebook: {type: String, default: ''},
  fbTokens: Array,
  google: {type: String, default: ''},
  sentRequest: [{
    username: {type: String,default: ''}
  }],
  request: [{
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    username: {type: String,default: ''}
  }],
  friends: [{
    friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    friendName: {type: String,default: ''}
  }],
  totalRequest: {type: Number,default: 0}
});

UserSchema.methods.encryptPassword = password => {
  return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
};

UserSchema.methods.validUserPassword = function(password) {
  return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('users',UserSchema);
