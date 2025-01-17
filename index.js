const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 4000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("location", (data) => {
    const { roomId, latitude, longitude } = data;
    console.log(`User ${socket.id} sent location (${latitude}, ${longitude})`);
    socket.to(roomId).emit("receive-location", { latitude, longitude });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnect", socket.id);
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
