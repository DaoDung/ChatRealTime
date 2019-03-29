var express = require("express");
var path = require("path");

var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.get("/", function(req, res){
  res.render("trangchu");
});
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3111);

var Users=[];
var connection=[];
var Room=[];
io.on("connection", function(socket){
  connection.push(socket);
  console.log('Connect:  %s socket connected', connection.length);
  // Disconnect
  socket.on('disconnect', function(data){
    Users.splice(Users.indexOf(socket.username), 1)
    connection.splice(connection.indexOf(socket),1);
    console.log('Disconnected: %s socket connected', connection.length);
    UpdateUsernames();
  });
  // Send Message
  socket.on('send message', function(data){
    console.log("Send"+socket.Phong);
    if(socket.Phong){
      console.log("1"+socket.Phong);
      io.sockets.in(socket.Phong).emit("new message", {msg: data, user: socket.username});
    }
    else{
      socket.emit("chua chon phong", data);
    }
  
  });
  // New user
  socket.on('new user',function(data){
    socket.username=data;
    Users.push(socket.username);
    UpdateUsernames();
    UpdateRooms();
  });

  // Create or Join Room
  socket.on('create room',function(data){
    Room.push(data);
    UpdateRooms();
  });

  // JoinToRoom
  socket.on('JoinToRoom',function(data){
    console.log('JoinToRoom'+data)
    socket.Phong=data;
    socket.join(data);
    console.log('socket.Phong'+socket.Phong)
    
  });

  socket.on('user image', function(image) {
    console.log('da nhan dc anh');
    console.log(image);
    io.sockets.emit('addimage','Imagen Compartida:', image);
    
  })
});

function UpdateUsernames(){
  io.sockets.emit('get users',Users)
}
function UpdateRooms(){
  io.sockets.emit('get rooms',Room)
}

