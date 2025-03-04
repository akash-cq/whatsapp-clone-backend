let users = {};

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
    console.log(receiverId, "52");
    if (users[receiverId]) {
      console.log(users, "isonline");
      socket.emit("online", true);
    } else {
      console.log(users[receiverId], "57");
      socket.emit("offline", { id: receiverId, status: false });
    }
  });
}
function handleMsg(socket) {
  socket.on("sendMsg", ({ receiverId, payload }) => {
    console.log(users, "sendmsg");
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
      console.log("typing... ");
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
module.exports = {
  handleUserJoin,
  typingHandle,
  handleMsg,
  handleUserOnline,
  disconnetionUser,
};