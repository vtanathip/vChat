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
var mongo = require('mongodb');

//db server uri
var mongoUri = 'mongodb://vtanathip:smarty@paulo.mongohq.com:10081/app18642167';;

//connect to database
mongo.Db.connect(mongoUri, function (err, db) {
    winston.info('database connected: ' + db + " ||| " + err);
    db.collection('mydocs', function(er, collection) {
        collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
            winston.info('database inserted response:' + rs + " ||| " + er);
        });
    });
});

// listening to port...
server.listen(process.env.PORT || port, function(){
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

    socket.on('addNewClient', function(data){
        addNewClient(socket, data);
    });

    socket.on('disconnect', function(data){
        removeClient(socket, data);
    });

    socket.on('sendMSG', function(data){
        sendMSG(socket, data);
    });

});

//notify joined user and add user to list
function addNewClient(socket, data){

    //user socket.id for keep nickName
    vClient[socket.id] = data;

    winston.info('New client join room : ' +  vClient[socket.id].clientName);

    socket.broadcast.emit('notification_join_client', { clientName : vClient[socket.id].clientName });

}

//notification leave user and remove out from list
function removeClient(socket,data){
    //check condition client is in array or not
    if(vClient[socket.id]!=null){
        socket.broadcast.emit('notification_leave_client', { clientName : vClient[socket.id].clientName });
        //remove client
        delete vClient[socket.id];
    }
}

//send msg to everyone
function sendMSG(socket,data){
    winston.info('Msg from ' + data.username + ' is : ' +  data.chatMSG);
    //send msg to everyone except sender
    socket.broadcast.emit('broadcast_msg', { chat_msg : data.chatMSG , username : data.username , type : "sender" } );
    //send msg to client
    socket.emit('broadcast_msg', { chat_msg : data.chatMSG , username : data.username , type : "owner" });
}