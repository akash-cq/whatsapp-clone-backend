const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chat", required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  sender: {
    type: String,
  },
  senderName: {
    type: String,
  },
  msg: { type: String, required: true },
  fileUrl: { type: String,default:null },
  timestamp: { type: String },
  isRead: { type: Boolean, default: false },
});

const Message = mongoose.model("message", MessageSchema);
module.exports = Message;
