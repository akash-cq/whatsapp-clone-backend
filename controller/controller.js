const User = require("../model/user");
const Chat = require("../model/chat");
const Message = require("../model/message");
const bcrypt = require("bcrypt");
const { setAssign } = require("../middleware/auth");
async function Registartion(req, res) {
  const { name, email, password } = req.body;
  if (
    name.trim() == "" ||
    email.trim() == "" ||
    password.trim() == "" ||
    password.length <= 6
  ) {
    return res
      .status(401)
      .json({ msg: "something is wrong in credential please check" });
  }
  try {
    const payload = {
      userName: name.replace(/\s/g, ""),
      email: email.replace(/\s/g, ""),
      password: password.replace(/\s/g, ""),
    };
    // console.log(payload);
    const isemailExist = await User.findOne({ email: payload.email });
    if (isemailExist != null)
      return res.status(401).json({ msg: "user already exist" });
    const salt = await bcrypt.genSalt(10);
    const hashP = await bcrypt.hash(payload.password, salt);

    const user = new User({
      userName: payload.userName,
      email: payload.email,
      password: hashP,
    });
    await user.save();
    return res.status(200).json({ msg: "successfuly registred" });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ msg: "internal error", err });
  }
}
async function UserLoginhandle(req, res) {
  if (req.body.email.trim() == "" || req.body.password.trim() == "")
    return res.status(400).json({ msg: "credentilas filed is empty!!!" });
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };
  // console.log(payload);
  try {
    const userdetail = await User.findOne({ email: payload.email });
    // console.log(userdetail);
    if (userdetail == null) {
      return res.status(400).json({ msg: "user credentail wrong" });
    }
    // console.log(userdetail)
    const result = await bcrypt.compare(payload.password, userdetail.password);

    if (!result) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const obj = {
      email: payload.email,
      id: userdetail._id,
    };
    const token = setAssign(req, res, obj);
    return res.status(200).json({ msg: "user is verified", token });
  } catch (err) {
    (err);
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
    const userdetail = req.obj;

    const users = await User.find({ _id: { $ne: userdetail.id } });

    let arr = [];

    for (const obj of users) {
      const payload = {
        name: obj?.userName,
        dp: obj?.dp,
        id: obj?._id,
      };

      const isExist = await exist(userdetail.id, obj._id); // Await here
      payload.lastMsg = isExist ? isExist.lastMessage : null;
      payload.time = isExist ? isExist.updatedAt : null;
      payload.senderName = isExist?.senderName;
      payload.timestamp = isExist?.timestamp;
      payload.isFile = isExist?.isFile;
      payload.isRead = isExist?.isRead;
      payload.senderId = isExist?.senderId;
      arr.push(payload);
    }

    return res.status(200).json({ msg: "success", arr });
  } catch (err) {
    (err);
    return res.status(500).json({ msg: "internal error", err });
  }
}

async function PersonalDetail(req, res) {
  try {
    const userdetails = req.obj;
    const user = await User.findById(userdetails.id);
    if (user == null) return res.status(404).json({ msg: "not found" });
    return res.status(200).json({ msg: "success ", user });
  } catch (err) {
    return res.status(500).json({ msg: "internal error" });
  }
}
async function MsgHandle(req, res) {
  try {
    ("hello world", req.body);
    const { senderId, receiverId, msg, timestamp, isRead } = req.body;
    const username = await User.findById(senderId);
    const payloadForchat = {
      participants: [senderId, receiverId],
      lastMessage: msg,
      updatedAt: timestamp,
      senderName: username.userName,
      senderId:senderId,
      isRead:false
    };

    let IsExist = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (IsExist) {
      IsExist.lastMessage = msg;
      IsExist.senderName = username.userName;
      IsExist.updatedAt = timestamp;
      IsExist.senderId = senderId;
      IsExist.isRead = false;
      await IsExist.save();
    } else {
      IsExist = await Chat.create(payloadForchat);
      await IsExist.save();
    }
    console.log(IsExist)
    const payloadForMsg = {
      chatId: IsExist._id,
      senderId: senderId,
      receiverId: receiverId,
      msg: msg == null ? "no message yet" : msg,
      isRead: isRead || false,
      senderName: username.userName,
      timestamp: timestamp,
    };
   // // // console.log(req.body);
    if (req.body.fileUrl) {
      IsExist.isFile = true;
      await IsExist.save();
      // // console.log("wsdcfvb ");
      payloadForMsg.fileUrl = req.body.fileUrl;
    }else{
      IsExist.isFile = false;
      await IsExist.save();
    }
    const msgModel = await Message.create(payloadForMsg);
    await msgModel.save();
    // // // console.log(msgModel);
    return res.status(200).json({ msg: "succesfuly saved", msgModel });
  } catch (err) {
    // // console.log(err);
    res.status(500).json({ err, msg: "internal error" });
  }
}
async function getMsgHandle(req, res) {
  try {
    const { receiverId } = req.body;
    const userdetail = req.obj;
    const senderId = userdetail.id;
    // // console.log("come");
    // // console.log(senderId, receiverId, "wdfghnm");
    const chatId = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    let obj = [];
    // // console.log(chatId);
    if (chatId == null) return res.status(404).json({ msg: "not found", obj });
    const Messages = await Message.find({ chatId: chatId?.id });
    if (Messages.length == 0)
      return res.status(404).json({ msg: "not found", obj });
    Messages?.forEach((msgs) => {
      const payloadSend = {
        msg: msgs.msg,
        senderId: msgs.senderId,
        receiverId: msgs.receiverId,
        sender: msgs.sender,
        senderName: msgs.senderName,
        timestamp: msgs.timestamp,
        msgId: msgs._id,
        fileUrl: msgs.fileUrl,
        isRead:msgs.isRead
      };
      obj.push(payloadSend);
    });
    return res.status(200).send(obj);
  } catch (err) {
    // // console.log(err);
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
async function uploadProfileDp(req, res) {
  try {
    if (req.file == null) {
      // // console.log("error in file");
      return res.status(400).json({ msg: "file not found" });
    }
    const user = req.obj;
    // // console.log(req.file);
    const userDetail = await User.findById(user.id);
    const cleanPath = req.file.path.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
    const fileUrl = `${req.protocol}://${req.get("host")}/${cleanPath}`;
    userDetail.dp = fileUrl;
    await userDetail.save();
    return res
      .status(200)
      .json({ msg: "profile pic uploaded successfully", dp: fileUrl });
  } catch (err) {
    // // console.log(err);
    return res.status(500).json({ msg: "internal error" });
  }
}
async function uploadMsgFile(req, res) {
  try {
    // // console.log(req.file);
    if (req.file == null) {
      // // console.log("error in file");
      return res.status(400).json({ msg: "file not found" });
    }

    const cleanPath = req.file.path.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
    const fileUrl = `${req.protocol}://${req.get("host")}/${cleanPath}`;
    return res.status(200).json({ msg: "file uploaded successfully", fileUrl });
  } catch (err) {
    // // console.log(err);
    return res.status(500).json({ msg: "internal error" });
  }
}
async function logout(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ msg: "logout successfully" });
  } catch (err) {
    // // console.log(err);
    return res.status(500).json({ msg: "internal error" });
  }
}
async function changebio(req, res) {
  try {
    const userdetail = req.obj;
    console.log(req.obj)
    const { bio } = req.body;
    console.log(req.body)
    if(!bio)return res.status(403).json({msg:"no value"})
    if (!userdetail?.id) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    const updatedUser = await User.findById(userdetail.id)

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    updatedUser.about = bio
    await updatedUser.save();
console.log(updatedUser)
    res.status(200).json({
      message: "Bio updated successfully",
      bio: bio,
    });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
  uploadProfileDp,
  logout,
  uploadMsgFile,
  changebio,
};
