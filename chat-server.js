//load libraries, init server, listener
var  http    = require('http')
    //web framework
    ,express = require('express')
    //logging libraries
    ,winston = require('winston')
    ,app     = express()
    ,server  = http.createServer(app)
    //socket libraries
    ,io      = require('socket.io').listen(server)
    ,port    = 5055;

// list of username
var usernames = {};

// listening to port...
server.listen(port, function(){
    console.log("Chat Server up and running. Go to http://" + "127.0.0.1" + ":" + port);
});

// static files
app.use("/css", express.static( __dirname + '/css'));
app.use("/js", express.static( __dirname + '/js'));
app.use("/images", express.static( __dirname + '/images'));

// client request to root app @ http://127.0.0.1:5055
app.get('/', function (request, response) {
    response.sendfile(__dirname + '/index.html');
});

//set io to show only info
io.set('log level',2);

//every connection will go through this event handler
io.sockets.on('connection', function(socket){

    socket.on('adduser', function(data){
        adduser(socket, data);
    });

    socket.on('disconnect', function(){
        disconnect(socket);
    });
});

//custom event action
function adduser(socket, data){
    usernames[data] = data;
    winston.info(usernames[data]);
    socket.emit('updatelobby', usernames[data]);
}

function disconnect(socket, data){

}