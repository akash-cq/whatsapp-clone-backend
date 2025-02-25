const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  ],
  lastMessage: { type: String },
  senderName:{type:String},
  updatedAt: { type: String },
  timestamp:{type:Date, default:Date.now}
});

const Chat = mongoose.model("chat", ChatSchema);
module.exports = Chat;
