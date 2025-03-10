const { default: mongoose } = require("mongoose");
const Group = require("../model/Group");
const GroupMsg = require("../model/GroupMsg");
async function GroupCreation(req, res) {
  try {
    const members = req.body.members;
    const payload = {
      adminid: req.body.admin || req.obj.id,
      name: req.body.name.trim()
    };
    console.log(payload);
    const isExistGroup = await Group.find({ name: payload.name });
    if(isExistGroup.length>0)return res.status(400).json({msg:'already exist'})
    const group = new Group({
      participants: members,
      name: payload.name,
      adminid: payload.adminid,
    });
    await group.save();
    res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
}
async function getGroups(req, res) {
  try {
    // console.log(req.obj, "sdcfv");
    const { id } = req.obj;
    const groups = await Group.find({ "participants.userid": id });

    return res.status(200).json({ msg: "success" ,groups});
  } catch (error) {
    console.log(err);
    return res.status(500).json({ msg: "internal error" });
  }
}
async function GroupMsgHandle(req,res) {

  try{

    const {GroupId , msg,senderName,fileurl,senderId,timestamp } = req.body;
    const payload = {
      GroupId: GroupId,
      msg: msg,
      senderName: senderName,
      fileurl: fileurl,
      senderId: senderId,
      timestamp:timestamp,
    };
    const grp = await Group.findByIdAndUpdate(GroupId, {
      $set: {
        senderId: senderId,
        updatedAt: timestamp,
        lastMessage:msg,
        senderName:senderName,
      },
    },
    {new:true},
  );
  if(!grp)return res.status(404).json({ msg: "404 group not found" });
  const msgs = new GroupMsg(payload);
  await msgs.save()
  return  res.status(200).json({ msg: "success" });

  }catch(err){
    console.log(err)
    return res.status(500).json({msg:"internal error"})
  }
  
}
async function getGroupMsg(req,res) {
  try {
    
    const { receiverId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ msg: "Invalid Receiver ID format" });
    }

    const msgs = await GroupMsg.find({ GroupId: receiverId });
    if(msgs.length<=0)return res.status(404).json({msg:"404 no messages found"});
    return res.status(200).json(msgs); 

  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"internal error"});
  }
  
}
module.exports = { GroupCreation, getGroups, GroupMsgHandle, getGroupMsg };
