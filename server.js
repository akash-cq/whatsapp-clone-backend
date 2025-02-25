const express = require("express");
const app = express();
const connectDb = require("./mongoDbConnection");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const socket = require("socket.io");
const router = require("./routes/routes");
app.use(cookieParser()); // Enables cookie parsing
app.use(express.json());
let users = {};

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads")); 
app.use("/", router);
const server = app.listen(3000, () => {
  console.log("server listen on port 3000");
});
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("join", (userId) => {
    if(!users[userId]) {
    users[userId] = socket.id
    }
    else {
      console.log("user already connected");
    }
    console.log(users, "join");
  });

  socket.on("isOnline", ({ receiverId }) => {
    if (users[receiverId]) {
      console.log(users, "isonline");
      socket.emit("online", true);
    } else {
    socket.emit("offline", { id: receiverId, status: false });
    }
  });

  socket.on("sendMsg", ({ receiverId, payload }) => {
    console.log(users, "sendmsg");
    if (users[receiverId]) {
      io.to(users[receiverId]).emit("recieveMsg", payload);
    } else {
      console.log("user is offline");
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
    console.log("user disconnected");
    console.log(id, " user disconnected\n", users);
    socket.broadcast.emit("offline", { id: id, status: false });
  });
});
connectDb();
