(function ($) {
    var serverAddress = 'http://127.0.0.1:5055',
        socket        = null;

    socket =  io.connect(serverAddress);

    socket.on('connect', function(){
        // call the server-side function 'adduser' and send one parameter (value of prompt)
        socket.emit('adduser', { 'nickname' : prompt("What's your name?") });
    });

    // listener, whenever the server emits 'updatelobby', this updates the lobbylist
    socket.on('updateLobby', function (data) {
        console.log('new client is ' + data.username);
        $('#vchat_list').append('<b>' + data.username + ':</b> ');
    });

    socket.on('updateChat', function(data){
        console.log('new msg is ' + data.msg);
        $('#chat_box').append('<b>' + data.msg + ':</b><br/>');
    });

    $('#send_msg_btn').click(function(){
        var msg = $('#msg_box').val();
        //log msg value
        console.log('msg is ' + msg);
        //send msg to server to broadcast
        socket.emit('broadcast_msg', { 'msg' : msg });
    });

})(jQuery);