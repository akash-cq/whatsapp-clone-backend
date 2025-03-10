let users = {};
let Chat = require("../model/chat");
let Messages = require("../model/message");

const socket = (io) => {
  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      if (!users[userId]) {
        users[userId] = socket.id;
      } else {
        console.log("User already connected");
      }
    });

    socket.on("isOnline", ({ receiverId }) => {
      if (users[receiverId]) {
        socket.emit("online", true);
      } else {
        socket.emit("offline", { id: receiverId, status: false });
      }
    });

    socket.on("sendMsg", ({ receiverId, payload }) => {
      if (users[receiverId]) {
        io.to(users[receiverId]).emit("recieveMsg", payload);
      } else {
        console.log("User is offline");
      }
    });

    socket.on("typing", ({ senderId, isType, receiver }) => {
      if (users[receiver]) {
        socket.to(users[receiver]).emit("isTyping", { senderId, isType });
      } else {
        console.log("User is offline");
      }
    });

    socket.on("disconnect", () => {
      let id = null;
      for (let userId in users) {
        if (users[userId] === socket.id) {
          id = userId;
          delete users[userId];
          break;
        }
      }
      socket.broadcast.emit("offline", { id: id, status: false });
    });

    socket.on("AllRead", async ({ writer, reader }) => {
      let IsExist = await Chat.findOne(
        { participants: { $all: [writer, reader] } },
        { _id: 1, senderId: 1, isRead: 1 }
      );
      if (IsExist == null) return;
      if (!IsExist.isRead && reader != IsExist.senderId) {
        IsExist.isRead = true;
        await IsExist.save();
        await Messages.updateMany({ chatId: IsExist._id }, { isRead: true });
        io.to(users[writer]).emit("DoneReading", { reader });
      }
    });

    socket.on("newuser", () => {
      io.emit("newuser");
    });
    socket.on("joinGrp", ({ id }) => {
      socket.join(id);
      io.to(id).emit("someone");
    });
    socket.on("msgInGrp", ({ receiver, payload })=>{
      socket.to(receiver).emit('sendMsgIngrp',payload)
    })
     socket.on("logout", ({userid}) => {
       let id = users[userid];
       socket.broadcast.emit("offline", { id: id, status: false });
     });
  });
};

module.exports = socket;
