
var socket = io.connect('http://192.168.0.102:3111/');
var btnSend = $('#btnSend');
var message = $('#message');
var msg_history= $('#msg_history');


var username = $('#username');
var users = $('#users');
var roomName = $('#roomName');
var btnRoom = $('#btnRoom');
var toRoom = $('#toRoom');
var rooms = $('#rooms');
$(document).ready(function(){
  $("#loginForm").show();
  $("#chatForm").hide();


  $("#btnRegister").click(function(){
    socket.emit('new user',username.val());
    $("#loginForm").hide();
    $("#chatForm").show();
    $("#ten").append(username.val());
  //  $("body").css('background-image', 'url("https://img.phunudep.com/wp-content/uploads/2016/01/tuyen-tap-nhung-hinh-nen-cho-may-tinh-dep-nhat-anh-24.jpg")');
  });
  message.focusin(function(){
    socket.emit("toi-dang-go-chu");
  });
  message.focusout(function(){
    socket.emit("toi-stop-go-chu");
  });
});




btnSend.click(function() {
  socket.emit('send message',message.val());
  message.val('');
})

socket.on('new message', function(data){
  if( data.user !== username.val() ){
    msg_history.append('<div class="incoming_msg">'
                    +      '<div class="incoming_msg_img"> <strong>'+data.user+':</strong> </div>'
                    +       '<div class="received_msg">'
                    +          '<div class="received_withd_msg">'
                    +            '<p>'+data.msg+'</p>'
                    +            '<span class="time_date"> 11:01 AM    |    June 9</span></div>'
                    +        '</div>'
                    +    '</div>'
    );
  }
  else{
    msg_history.append('<div class="outgoing_msg">'
                    +     '<div class="sent_msg">'
                    +         '<p>'+data.msg+'</p>'
                    +         '<span class="time_date"> 11:01 AM    |    June 9</span>'
                    +     '</div>'
                    +   '</div>'
    );
  }

});
// Get List User
socket.on('get users', function(data){
  var html = '';
  for(let i = 0; i < data.length; i++){
    html += '<div class="chat_list">'
          +     '<div class="chat_people">'
          +           '<div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>'
          +           '<div class="chat_ib">'
          +                 '<h5>'+data[i]+' <span class="chat_date"><i class="fas fa-circle"></i></span></h5>'
          +           '</div>'
          +      '</div>'
          + '</div>'
    ;
  }
  users.html(html);
});

btnRoom.click(function(){
  socket.emit('create room',roomName.val());
  roomName.val('');

})
// Get List Rooms
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
  alert('Bạn đã tham gia phòng: ' + data)
  msg_history.html('');
}

socket.on('addimage',function(data){
  if( data.user !== username.val() ){
    msg_history.append('<div class="incoming_msg">'
                    +      '<div class="incoming_msg_img"> <strong>'+data.user+':</strong> </div>'
                    +       '<div class="received_msg">'
                    +          '<div class="received_withd_msg">'
                    +            '<p><img src="'+data.image+'"  /></p>'
                    +            '<span class="time_date"> 11:01 AM    |    June 9</span></div>'
                    +        '</div>'
                    +    '</div>'
    );
  }
  else{
    msg_history.append('<div class="outgoing_msg">'
                    +     '<div class="sent_msg">'
                    +         '<p><img src="'+data.image+'"  /></p>'
                    +         '<span class="time_date"> 11:01 AM    |    June 9</span>'
                    +     '</div>'
                    +   '</div>'
    );
  }

});
socket.on("ai-do-dang-go-chu", function(data){
  if( data.user !== username.val() ){
    msg_history.append('<div id="thongbao">'
                    +       '<p><strong>'+data.user+':</strong> <img width="20px" src="typing05.gif"></p>'
                    +   '</div>');
  }

});
socket.on("ai-do-STOP-go-chu", function(){
  $("#thongbao").remove();
});

$(function(){
    $("#fileSelector").on('change',function(e){
        var file = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function(evt){
            socket.emit('change image',evt.target.result)

        };
        reader['readAsDataURL'](file);
    })
})
