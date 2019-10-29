var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

users = [];
connectons = [];

app.use(express.static(__dirname + '/public'));

server.listen(process.env.PORT || 3000);
console.log("Server Running...");

app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index.html');
});

io.sockets.on('connection',function(socket){
    connectons.push(socket);
    console.log("Connected: %s sockets connected.",connectons.length);

    // Disconnect
    socket.on('disconnect',function(data){
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connectons.splice(connectons.indexOf(socket),1);
        console.log("Disconnected: %s sockets connected.",connectons.length);
    });

    //Send message
    socket.on('send message', function(data){
        io.sockets.emit('new message',{msg: data, user: socket.username});
    });

    //New User
    socket.on('new user', function(data , callback){
        socket.username = data;
        users.push(data);
        updateUsernames();
    });

    //New User
    socket.on('sign out', function(data , callback){
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connectons.splice(connectons.indexOf(socket),1);
        console.log("Disconnected: %s sockets connected.",connectons.length);
    });

    function updateUsernames(){
        io.sockets.emit('get users',users);
    }
});