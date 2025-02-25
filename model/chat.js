const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  ],
  lastMessage: { type: String },
  senderName:{type:String},
  updatedAt: { type: String },
});

const Chat = mongoose.model("chat", ChatSchema);
module.exports = Chat;
