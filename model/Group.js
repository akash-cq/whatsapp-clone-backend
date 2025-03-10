const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  participants: [
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      MemberName: { type: String, required: true },
      dp: { type: String, default: null },
    },
  ],
  name: {
    type: String,
    required: true,
    unique: true,
  },
  lastMessage: { type: String, default: "" },
  senderName: { type: String, default: "" },
  updatedAt: { type: String, default: "" },
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  isFile: { type: Boolean, default: false },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  dp: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/business-man-icon-team-work-260nw-404838214.jpg",
  },
});

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
