let users = {};
let Chat = require("../model/chat");
let Messages = require("../model/message");
function handleUserJoin(socket) {
  socket.on("join", (userId) => {
    if (!users[userId]) {
      users[userId] = socket.id;
    } else {
      console.log("user already connected");
    }
    console.log(users, "join");
  });
}
function handleUserOnline(socket) {
  socket.on("isOnline", ({ receiverId }) => {
    if (users[receiverId]) {
      console.log(users, "isonline");
      socket.emit("online", true);
    } else {
      socket.emit("offline", { id: receiverId, status: false });
    }
  });
}
function handleMsg(socket, io) {
  socket.on("sendMsg", ({ receiverId, payload }) => {
    if (users[receiverId]) {
      io.to(users[receiverId]).emit("recieveMsg", payload);
    } else {
      console.log("user is offline");
    }
  });
}
function typingHandle(socket) {
  socket.on("typing", ({ senderId, isType, receiver }) => {
    if (users[receiver]) {
      socket.to(users[receiver]).emit("isTyping", { senderId, isType });
    } else {
      console.log("offline");
    }
  });
}
function disconnetionUser(socket) {
  socket.on("disconnect", () => {
    let id = null;
    for (let userId in users) {
      if (users[userId] === socket.id) {
        id = userId;
        delete users[userId];
        break;
      }
    }
    console.log("user disconnected");
    console.log(id, " user disconnected\n", users);
    socket.broadcast.emit("offline", { id: id, status: false });
  });
}
function Allread(socket, io) {
  socket.on("AllRead", async ({ writer, reader }) => {
    console.log(`all message read by ${writer} from ${reader}`);
    let IsExist = await Chat.findOne(
      { participants: { $all: [writer, reader] } }, // Query condition
      { _id: 1, senderId: 1, isRead: 1 } // Projection
    );
    console.log(IsExist, "sdcfvb");
    if (IsExist == null) return;
    if (!IsExist.isRead && reader != IsExist.senderId) {
      console.log("hello 65");
      IsExist.isRead = true;
      await IsExist.save();
      await Messages.updateMany({ chatId: IsExist._id }, { isRead: true });
      io.to(users[writer]).emit("DoneReading", { reader });
    }
  });
}
function signup(socket,io){
  socket.on("newuser",()=>{
    io.emit("newuser")
  });
}
module.exports = {
  handleUserJoin,
  typingHandle,
  handleMsg,
  handleUserOnline,
  disconnetionUser,
  Allread,
  signup,
};
