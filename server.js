const express = require("express");
const app = express();
const connectDb = require("./mongoDbConnection");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const socket = require("socket.io");
const router = require("./routes/routes");
require("dotenv").config();
const socketIo = require("./controller/socket");
const { authentication } = require("./middleware/auth");
app.use(cookieParser()); // Enables cookie parsing
app.use(express.json());
// const static = require("./middleware/static");
// app.use("/uploads", static("uploads")); 

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS",],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("/", router);

app.use("/uploads", express.static("uploads")); 
console.log("server listen on port 3000");
const server = app.listen(process.env.PORT, () => {
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});
socketIo(io)
connectDb();
