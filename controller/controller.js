const User = require("../model/user");
const Chat = require("../model/chat");
const Message = require("../model/message");
const { setAssign, getData } = require("../middleware/auth");
async function Registartion(req, res) {
  const { name, email, password } = req.body;
  try {
    const payload = {
      userName: name,
      email: email,
      password: password,
    };
    const isemailExist = await User.findOne({ email: payload.email });
    if (isemailExist != null)
      return res.status(401).json({ msg: "user already exist" });

    const user = new User({
      userName: payload.userName,
      email: payload.email,
      password: payload.password,
    });
    await user.save();
    return res.status(200).json({ msg: "successfuly registred" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal error", err });
  }
}
async function UserLoginhandle(req, res) {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const userdetail = await User.findOne({ email: payload.email });
    if (userdetail == null || userdetail?.password != payload.password) {
      return res.status(400).json({ msg: "user credentail wrong" });
    }
    const obj = {
      email: payload.email,
      id: userdetail._id,
    };
    const token = setAssign(req, res, obj);
    return res.status(200).json({ msg: "user is verified", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal error", err });
  }
}
async function exist(senderId, receiverId) {
  return await Chat.findOne({
    participants: { $all: [senderId, receiverId] },
  });
}

async function ContactsData(req, res) {
  try {
    const userdetail = await getData(req, res); // Await if getData is async

    const users = await User.find({ _id: { $ne: userdetail.id } });
    let arr = [];

    for (const obj of users) {
      const payload = {
        name: obj?.userName,
        dp: obj?.dp,
        id: obj?._id,
      };

      const isExist = await exist(userdetail.id, obj._id); // Await here
      payload.lastMsg = isExist ? isExist.lastMessage : "No messages yet";
      payload.time = isExist ? isExist.updatedAt : null;
      payload.senderName = isExist?.senderName;

      arr.push(payload);
    }

    return res.status(200).json({ msg: "success", arr });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal error", err });
  }
}

async function PersonalDetail(req, res) {
  try {
    const userdetails = getData(req, res);
    const user = await User.findById(userdetails.id);
    if (user == null) return res.status(404).json({ msg: "not found" });
    return res.status(200).json({ msg: "success ", user });
  } catch (err) {
    return res.status(500).json({ msg: "internal error" });
  }
}
async function MsgHandle(req, res) {
  try {
    console.log("hello world", req.body);
    const { senderId, receiverId, msg, timestamp, isRead } = req.body;
    const username = await User.findById(senderId);
    const payloadForchat = {
      participants: [senderId, receiverId],
      lastMessage: msg,
      updatedAt: timestamp,
      senderName: username.userName,
    };

    let IsExist = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (IsExist) {
      IsExist.lastMessage = msg;
      IsExist.senderName = username.userName;
      IsExist.updatedAt = timestamp;
      await IsExist.save();
    } else {
      IsExist = await Chat.create(payloadForchat);
      await IsExist.save();
    }
    const payloadForMsg = {
      chatId: IsExist._id,
      senderId: senderId,
      receiverId: receiverId,
      msg: msg,
      isRead: isRead || false,
      senderName: username.userName,
      timestamp: timestamp,
    };
    const msgModel = Message.create(payloadForMsg);
    return res.status(200).json({ msg: "succesfuly saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, msg: "internal error" });
  }
}
async function getMsgHandle(req, res) {
  try {
    const { receiverId } = req.body;
    const userdetail = getData(req, res);
    const senderId = userdetail.id;
    const chatId = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    const Messages = await Message.find({ chatId: chatId?.id });
    let obj = [];
    Messages.forEach((msgs) => {
      const payloadSend = {
        msg: msgs.msg,
        senderId: msgs.senderId,
        receiverId: msgs.receiverId,
        sender: msgs.sender,
        senderName: msgs.senderName,
        timestamp: msgs.timestamp,
      };
      obj.push(payloadSend);
    });
    return res.status(200).send(obj);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal error" });
  }
}
async function getInformation(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user == null) return res.status(404).json({ msg: "not found" });
    return res.status(200).json({ msg: "success ", user });
  } catch (err) {
    return res.status(500).json({ msg: "internal error" });
  }
}
module.exports = {
  Registartion,
  UserLoginhandle,
  ContactsData,
  PersonalDetail,
  MsgHandle,
  getMsgHandle,
  getInformation,
};
