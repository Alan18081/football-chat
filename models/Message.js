const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: String,
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  senderName: String,
  receiverName: String,
  senderImage: {type: String, default: 'default.png'},
  isRead: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('messages',MessageSchema);