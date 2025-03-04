const {
  handleUserJoin,
  typingHandle,
  handleMsg,
  handleUserOnline,
  disconnetionUser,
} = require("./socketController");
const socket = (io) => {
  io.on("connection", (socket1) => {
    handleUserJoin(socket1)
      typingHandle(socket1)
      handleMsg(socket1)
      handleUserOnline(socket1)
      disconnetionUser(socket1)
      console.log("user connected");
  });
};
module.exports = socket;
