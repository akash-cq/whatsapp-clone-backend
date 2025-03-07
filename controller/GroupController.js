const Group = require("../model/Group");
async function GroupCreation(req, res) {
  try {
    const members = req.body.members;
    const payload = {
      adminid: req.body.admin || req.obj.id,
      name: req.body.name.trim()
    };
    console.log(payload);
    const isExistGroup = await Group.find({ name: payload.name });
    console.log(isExistGroup)
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
    console.log(req.obj, "sdcfv");
    const { id } = req.obj;
    const groups = await Group.find({ "participants.userid": id });
    console.log(groups);

    return res.status(200).json({ msg: "success" ,groups});
  } catch (error) {
    console.log(err);
    return res.status(500).json({ msg: "internal error" });
  }
}
module.exports = { GroupCreation, getGroups };
