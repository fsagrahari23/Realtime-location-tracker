const express = require('express');
const app=express();
const http = require('http');
const server = http.createServer(app)
const socketio = require('socket.io');
const io = socketio(server);
const path = require('path');

const port = 4000;

app.set("view engine","ejs");
app.set(express.static(path.join(__dirname,"public")));

io.on("connection",(socket)=>{
    socket.on('location',(data)=>{
 
      io.emit("receive",{id: socket.id , ...data})
    })
    socket.on("disconnect",()=>{
      io.emit("user-disconnect",socket.id);
    })
     console.log("connected");
}
)

app.get("/",(req,res)=>{
  res.render("index.ejs")
})

server.listen(port);