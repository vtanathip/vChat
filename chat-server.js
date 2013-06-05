//load libraries, init server, listener
var  http    = require('http')
    ,express = require('express')
    ,app     = express()
    ,server  = http.createServer(app)
    ,io      = require('socket.io').listen(server)
    ,port    = 5055;

// listening to port...
server.listen(port, function(){
    console.log("Chat Server up and running. Go to http://" + "localhost" + ":" + port);
});

// static files
app.use("/css", express.static( __dirname + '/css'));
app.use("/js", express.static( __dirname + '/js'));
app.use("/images", express.static( __dirname + '/images'));

// client request to root app @ http://localhost:5055
app.get('/', function (request, response) {
    response.sendfile(__dirname + '/index.html');
});

//every connection will go through this event handler
io.sockets.on('connection', function(socket){
    socket.on('connect', function(data){
        connect(socket, data);
    });
});
//custom event action
function connect(socket, data){

}