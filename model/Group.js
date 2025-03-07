const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  participants: [{
    userid:{ type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    MemberName:{type:String,required:true},
    dp:{type:String,default:null},
  }
  ],
  name:{
    type:String,
    required:true,
    unique:true
  },
  lastMessage: { type: String ,default:""},
  senderName: { type: String ,default:""},
  updatedAt: { type: String ,default:""},
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
});

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
