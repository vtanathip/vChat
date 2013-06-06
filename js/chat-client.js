(function () {
    var serverAddress = 'http://127.0.0.1:5055',
        socket        = null;

    socket =  io.connect(serverAddress);

    socket.on('connect', function(){
        // call the server-side function 'adduser' and send one parameter (value of prompt)
        socket.emit('adduser', prompt("What's your name?"));
    });

    // listener, whenever the server emits 'updatelobby', this updates the lobbylist
    socket.on('updatelobby', function (username) {
        $('#copyright_and_reference').append('<b>' + username + ':</b> ');
    });

}());