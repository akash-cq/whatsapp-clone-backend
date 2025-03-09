const mongoose = require("mongoose");
const GroupMessageSchema = new mongoose.Schema({
  GroupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  senderName: {
    type: String,
  },
  msg: { type: String, required: true },
  fileUrl: { type: String,default:null },
  timestamp: { type: String },
});

const GroupMsg =
  mongoose.models.grpmessage ||
  mongoose.model("grpmessage", GroupMessageSchema);
module.exports = GroupMsg;