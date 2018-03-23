const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  fullname: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    default: ''
  },
  userImage: {
    type: String,
    default: 'default.png'
  },
  facebook: {
    type: String,
    default: ''
  },
  fbTokens: Array,
  google: {
    type: String,
    default: ''
  },
  googleTokens: Array
});

UserSchema.methods.encryptPassword = password => {
  return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
};

UserSchema.methods.validUserPassword = function(password) {
  return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('users',UserSchema);
