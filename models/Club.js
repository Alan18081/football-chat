const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClubSchema = new Schema({
  club: {type: String, default: ''},
  country: {type: String, default: ''},
  image: {type: String, default: 'default.png'},
  fans: [{
    username: {type: String, default: ''},
    email: {type: String, default: ''}
  }]
});

module.exports = mongoose.model('clubs',ClubSchema);