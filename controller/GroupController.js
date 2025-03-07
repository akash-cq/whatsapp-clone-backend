const Group = require("../model/Group");
async function GroupCreation(req, res) {
  try {
    const members = req.body.members;
    const payload = {
      adminid: req.body.admin || req.obj.id,
      name: req.body.name || req.obj.name,
    };
    console.log(members)
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
module.exports = { GroupCreation };
