$(function() {

  var socket = io();

  var username;
  
  socket.on('user connected', function (data) {
    $("#playersPlaying").text(data.usernameList.length);
    for(var i = 0; i < data.usernameList.length; i++){
      $('#playersList').append('<li id=' + data.usernameList[i] + '>' + data.usernameList[i] +'</li>');
    }
  });
  
  
  
  socket.on('new question', function(data) {
      $("#question").text(data['question']);
      $("#answer").val("");
  });
  
  socket.on('correct question', function(data) {
      $("#result").text("Correct!");
  });
    socket.on('not correct question', function(data) {
      $("#result").text("Not correct!");
  });
  
  socket.on('user joined', function (data) {
    $("#playersPlaying").text(data.usernameList.length);
    $('#playersList').append('<li id=' + data.username + '>' + data.username +'</li>');
  });
  
  socket.on('user disconnected', function (data) {
    $("#playersPlaying").text(data.usernameList.length);
    $("#" + data.username).remove();
  });
  
  
  $("#send_answer").click( function(){
    var answer = $("#answer").val();
    
    socket.emit('check answer', {
      answer: answer
    });
  });
  $("#joinGame").click( function(){
    username = $("#username").val();
    $("#pre-combat").hide();
    $("#combat").show();
    
    socket.emit('join game', {
      username: username
    });
  });
});
