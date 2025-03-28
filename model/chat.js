const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  ],
  lastMessage: { type: String },
  senderName: { type: String },
  updatedAt: { type: String },
  timestamp: { type: Date, default: Date.now },
  isFile: { type: Boolean, default: false },
  isRead: {
    type: Boolean,
    default: false,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const Chat = mongoose.model("chat", ChatSchema);
module.exports = Chat;
