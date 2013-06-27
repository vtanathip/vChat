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

// array for keep username list
var vClient = new Object();
var myUserName;

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

    socket.on('disconnect', function(data){
        disconnect(socket,data);
    });

    socket.on('broadcast_msg',function(data){
        broadcast_msg(socket,data);
    });

});

//add username to list
function adduser(socket, data){

    myUserName =  data.nickname;
    //user socket.id for keep nickName
    vClient[socket.id] = data;

    winston.info('New client join room : ' +  vClient[socket.id].nickname);

    io.sockets.emit('updateLobby', { username : vClient[socket.id].nickname });
}

//delete user when disconnected
function disconnect(socket, data){
    if(vClient[socket.id] == null){
        winston.info('Gone without ID to handle it.');
    }else{
        winston.info('client ' + data + ' - ' + vClient[socket.id].nickname + ' left room.');
    }
    // remove the client
    delete vClient[socket.id];
}

//broadcast msg to everyone
function broadcast_msg(socket, data){
    //broadcast msg to everyone
	var msg_box;
    winston.info('msg comming is : ' + data.msg);
    if(data.username === myUserName){
        winston.info('you are the one' + data.username); 
		msg_box = '<div class="userchat">';
			msg_box += '<div class="chat_text">';
				msg_box += '<div class="bubble_me">' + data.msg + '</div>';
			msg_box += '</div>';
		msg_box += '</div>';
    }else{
        winston.info('not you' + data.username);
		msg_box = '<div class="senderchat">';
			msg_box += '<div class="sender_chat_username">';
				msg_box += '<div class="sender_chat_name">';
					msg_box += '<div class="sender_avatar"></div>';
					msg_box += '<span>'+ data.username +'</span>';
				msg_box += '</div>';
			msg_box += '</div>';
			msg_box += '<div class="sender_chat_text">';
				msg_box += '<div class="bubble_sender">';
					msg_box += data.msg;
				msg_box += '</div>';
			msg_box += '</div>';
		msg_box += '</div>';
    }

    io.sockets.emit('updateChat', { msg : data.msg , box : msg_box});
}