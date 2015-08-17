// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('\t :: Express :: Listening on port ' + port );
});

// Routing
app.use(express.static(__dirname + '/client'));

// userList which are currently connected to the chat
var userList = {};
var playersConnected = 0;
var playersInBattle = 0;


var enemyLife = 1000000;

function enemyAttack(socket_id){

    for (var key in userList){
        if(key == socket_id){
            userList[key].emit('you damaged')
        }
        else{
            userList[key].emit('ally damaged');
        }
    }
    //setTimeout(function() { enemyAttack() }, 10000)
}

function focusPlayer(username){
    io.sockets.emit('focus player', {
        focusedPlayer: username
    });
}
//
io.on('connection', function (socket) {
    //var addedUser = false;
    console.log('\t\tNew player connected');

    playersConnected++;
    
    io.sockets.emit('user connected',{
        playersConnected : playersConnected,
        playersInBattle : playersInBattle
    });

    socket.on('join battle', function (data) {
        userList[socket.id] = socket;
        playersInBattle++;
        io.sockets.emit('user joined battle',{
            username : data.username,
            playersInBattle : playersInBattle

        })
    });

    socket.on('disconnect', function () {
        console.log('\t\tPlayer disconnected');
        playersConnected--;
        if (userList[socket.id]){
            playersInBattle--;
            delete userList[socket.id];
        }
        io.sockets.emit('user disconnected',{
          playersConnected : playersConnected,
          playersInBattle : playersInBattle
        });
        //playersInBattle--;
        /*// remove the username from global userList list

        if (addedUser) {
            //delete userList[socket.username];
            

            // echo globally that this client has left
            /*socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }*/
    });

    socket.on('attack', function (data) {
        //enemyAttack(socket.id);
         enemyLife = enemyLife - 2;
         socket.broadcast.emit('ally attacked',{
           username : data.username
         });
         io.sockets.emit('enemy damaged', {
             enemyLife: enemyLife
         });
    });

});
