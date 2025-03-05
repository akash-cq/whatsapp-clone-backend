const {
  handleUserJoin,
  typingHandle,
  handleMsg,
  handleUserOnline,
  disconnetionUser,
  Allread,
} = require("./socketController");

const socket = (io) => {
  io.on("connection", (socket1) => {
    console.log("User connected:", socket1.id);

    socket1.removeAllListeners("join"); // Ensure event is not duplicated
    handleUserJoin(socket1);

    socket1.removeAllListeners("typing");
    typingHandle(socket1);

    socket1.removeAllListeners("sendMsg");
    handleMsg(socket1, io);

    socket1.removeAllListeners("isOnline");
    handleUserOnline(socket1);

    socket1.removeAllListeners("AllRead");
    Allread(socket1,io)
    socket1.removeAllListeners("disconnect");
    disconnetionUser(socket1);

  });
};

module.exports = socket;
