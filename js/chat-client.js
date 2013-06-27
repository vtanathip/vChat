(function ($) {
    var serverAddress = 'http://127.0.0.1:5055',
        socket        = null;

    var client_username;

    socket =  io.connect(serverAddress);

    //when client connected it will show bootstrap modal
    socket.on('connect', function(){
        $('#formUsername').modal({ backdrop: 'static', keyboard: true });
        $('#save-username-btn').click(function(){
            client_username = ($('#client_username').val() !== "")? $('#client_username').val() : "client-" + socket.socket.sessionid ;
            socket.emit('adduser', { 'nickname' : client_username });
        });
    });

    // append new div into username list but it must update all user.
    socket.on('updateLobby', function (data) {
        console.log('new client is ' + data.username);

        var new_client_div = "<div class='userdata'>";
            new_client_div += "<div class='user_avatar'></div>";
            new_client_div += "<div class='user_name'>"
                new_client_div += "<span class='user_text_name'>";
                new_client_div +=  data.username;
                new_client_div += "</span>";
                new_client_div += "<br class='clearfix'/>";
                new_client_div += "<span class=\"user_title\">Back-End Developer</span>";
            new_client_div += "</div>";
        new_client_div += "</div>";

        $('#list_username_content').append(new_client_div);
    });

    //shown data in box
    socket.on('updateChat', function(data){
        console.log('new msg is ' + data.msg);
        $('#show_chat_data').append(data.box);
    });

    //send chat data to server
    $('#enter_to_reply').click(function(){
        var msg = $('#input').val();
        //log msg value
        console.log('msg is ' + msg);
        //send msg to server to broadcast
        socket.emit('broadcast_msg', { 'msg' : msg , 'username' : client_username });
    });

})(jQuery);