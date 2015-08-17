// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('\t :: Express :: Listening on port ' + port );
});

app.use(express.static(__dirname + '/client'));

// userList which are currently connected to the chat

var allClients = [];
var usernameList = [];
var question_list = [
    ["Number of pi?", 3.14],
    ["Velocidad maxima guepardo en la sabana", 115],
    ["Color caballo blanco de Santiago", 'Blanco'],
    ["Cuantos años son la carrera de psicologia", 4],
];

var current_question;
var current_question_index;
new_question();

function new_question(){
    current_question_index = Math.floor(Math.random()*question_list.length)
    current_question = question_list[current_question_index][0];
}

io.on('connection', function (socket) {
    
    
    console.log('\tNew player connected');
    
    socket.emit('user connected',{
        usernameList : usernameList
    });
    
    socket.on('check answer', function (data) {
        if(data.answer == question_list[current_question_index][1]){
            socket.emit('correct question');
            new_question();
            
            io.sockets.emit('new question',{
               question : current_question 
            });
        }
        else{
            socket.emit('not correct question');
        }
    });

    
    socket.on('join game', function (data) {
        
        usernameList.push(data.username);
        allClients[socket.id] = data.username;
        
        console.log('\t\t' + data.username + ' joined');
        socket.emit('new question',{
            'question' : current_question
        });
        
        io.sockets.emit('user joined',{
            username : data.username,
            usernameList: usernameList
        });
        
    });
        
    
    socket.on('disconnect', function (data) {
        
        if (allClients[socket.id]){
            console.log('\t\t' + allClients[socket.id] +' disconnected');
            
            var i = usernameList.indexOf(allClients[socket.id]);
            usernameList.splice(i, 1);
            
            io.sockets.emit('user disconnected',{
                usernameList : usernameList,
                username : allClients[socket.id]
            });
            
            delete allClients[socket.id];
        }
        else{
            console.log('\tPlayer disconnected');
        }
    });

});
