const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupMessageSchema = new Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  text: {type: String},
  room: {type: String},
  createdAt: {type: String, default: Date.now}
});

module.exports = mongoose.model('groupMessage',GroupMessageSchema);