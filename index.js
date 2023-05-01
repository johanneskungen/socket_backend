const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
require("dotenv").config();
const URL =
  process.env.NODE_ENV === "production"
    ? "https://socket-frontend-ochre.vercel.app:4000"
    : "http://localhost:3000";
const io = new Server({
  cors: {
    origin: URL,
  },
});

io.listen(4000);

const users = [];

//Add this before the app.get() block
io.on("connection", (socket) => {
  console.log("Your ID is", socket.id);

  socket.on("room", (room) => {
    socket.join(room);
    socket.on("send-msg", (message) => {
      io.sockets.in(room).emit("chat", {
        message: message,
        name: users[socket.id],
        time: new Date().toLocaleTimeString(),
      });
    });

    //io.sockets.in(room).emit("connectRoom", "you are in room " + room);
  });

  socket.on("new-user", (name) => {
    const x = socket.id;
    users[x] = name;
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});
