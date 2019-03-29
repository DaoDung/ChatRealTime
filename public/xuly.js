var socket = io.connect('http://192.168.10.112:3111/');
$(document).ready(function(){
  $("#loginForm").show();
  $("#chatForm").hide();


  $("#btnRegister").click(function(){
    socket.emit('new user',username.val());
    $("#loginForm").hide();
    $("#chatForm").show();
    $("#ten").append(username.val());
  });

});

var messageForm = $('#messageForm');
var message = $('#message');
var chat = $('#chat');
var btnSend = $('#btnSend');
var username = $('#username');
var users = $('#users');
var roomName = $('#roomName');
var btnRoom = $('#btnRoom');
var toRoom = $('#toRoom');
var rooms = $('#rooms');


btnSend.click(function() {
  socket.emit('send message',message.val());
  message.val('');
})

socket.on('new message', function(data){
  chat.append('<div class="well"><strong>'+data.user+':</strong>'+data.msg+'</div>');
  
});

socket.on('get users', function(data){
  var html = '';
  for(let i = 0; i < data.length; i++){
    html += '<li class="list-group-item">'+data[i]+'<i class="fas fa-circle"></i></li>';
  }
  users.html(html);
});

btnRoom.click(function(){
  socket.emit('create room',roomName.val());
  roomName.val('');
})

socket.on('get rooms', function(data){
  var html = '';
  for(let i = 0; i < data.length; i++){
    html += '<li class="list-group-item">'+data[i]+'<input type="button" class="btn btn-primary" class="btnJoin" value="Join"></li>';
  }
  rooms.html(html);
  rooms.find('input').each(function(index) {
    $(this).on('click', () => JoinToRoom(data[index]))
  })
});

socket.on('chua chon phong', function(data){
  alert('Chưa chọn phòng chat');
});
function JoinToRoom(data){
  socket.emit('JoinToRoom',data);
}

socket.on('addimage',function(msg,base64image){
  alert('gui len'+base64image )
  $('.mensajes').append(
    $('p').append($('<b>'.text(msg),'<a target="_blank" href="'+base64image+'"><img src="'+base64image+'"/></a>'))
  );
});

$(function(){
    $("#imagefile").on('change',function(e){
      alert('da chon file222')
        var file = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function(evt){
            socket.emit('user image',evt.target.result)
      
        };
        reader['readAsDataURL'](file);
    })
})