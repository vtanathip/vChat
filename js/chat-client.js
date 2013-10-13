(function ($) {
    var serverAddress = 'http://127.0.0.1:5000',
        socket        = null;

    var username;

    var notification_tmpl = '<div class="notification" id="notification_content">';
        notification_tmpl += '<span class="${ notifyType }">';
            notification_tmpl += '<span class="notification_name">"${clientName}"</span> has ${type} the room.';
        notification_tmpl += '</span>';
    notification_tmpl += '</div>';

    var sender_tmpl = '<div class="sender">';
        sender_tmpl += '<span class="sender_name">${name}</span>';
        sender_tmpl += '<span class="msg_content">${msg}</span>';
        sender_tmpl += '<span class="timespan">${time}</span>';
    sender_tmpl += '</div>';

    var owner_tmpl = '<div class="owner">';
        owner_tmpl += '<span class="sender_name">${name}</span>';
        owner_tmpl += '<span class="msg_content">${msg}</span>';
        owner_tmpl += '<span class="timespan">${time}</span>';
    owner_tmpl += '</div>';

    socket =  io.connect(serverAddress);

    //focus on client key name and press enter then submit to server
    $('#clientName').keypress(function(event){
        handleClientName();
    });
	
	//extract handle client name
	function handleClientName(){
		// In Firefox, you have to use event.which to get the keycode; while IE support both event.keyCode and event.which.
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            $('#loginForm_wrapper').addClass('animated bounceOutLeft');
            setTimeout(function() {
                // code will happen after the timeout has completed : means animation is played
                $('#loginForm_wrapper').addClass('deleteElement');
            }, 500); // 1 second

            setTimeout(function() {
                // code will happen after the timeout has completed : means animation is played
                $('#chat_wrapper').fadeIn('fast');
                $('#msg_input').focus();

                $('#chat_content').slimscroll({
                    height: 'auto'
                });

            }, 700); // 1 second

            username = $('#clientName').val();
            //everything ready and send data to server
            socket.emit('addNewClient', { 'clientName' : username });

            console.debug('emit data to server clientName is ' + username );
        }
	}
	
    //focus on keypress chat msg
    $('#msg_input').keypress(function(event){

        console.debug('data send to server via keypress ' + $('#msg_input').val() );

        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            //everything ready and send data to server via handleChatMsg method
            handleChatMsg($('#msg_input').val(),username);
        }
    });

    //focus on send button msg
    $('#input_btn').click(function(){

        console.debug('data send to server via button ' + $('#msg_input').val() );

        //everything ready and send data to server via handleChatMsg method
        handleChatMsg($('#msg_input').val(),username);
    });

    socket.on('notification_join_client', function(data) {

        console.debug('notify join client is ' + data.clientName);

        notify(notification_tmpl, "notification_join_style", "join", data);
    });

    socket.on('notification_leave_client', function(data) {

        console.debug('notify left client is ' + data.clientName);

        notify(notification_tmpl, "notification_leave_style", "left", data);
    });

    socket.on('broadcast_msg', function(data){

        console.debug('msg from server is ' + data.chat_msg);

        var times = getDateTime();

        if(data.type === "sender"){
            $.tmpl( sender_tmpl, {
                "name" : data.username ,
                "msg" : data.chat_msg ,
                "time" : times } )
                .appendTo( "#chat_content" );
        }else if(data.type === "owner"){
            $.tmpl( owner_tmpl, {
                "name" : data.username ,
                "msg" : data.chat_msg ,
                "time" : times } )
                .appendTo( "#chat_content" );
        }

        //scrollbar to bottom
        $('#chat_content').slimscroll({
            scrollTo: $('#chat_content')[0].scrollHeight
        });

    });

    //extract method for handle msg event
    function handleChatMsg(val, username){
        socket.emit('sendMSG', { 'chatMSG' :  val , 'username' : username } );
        $('#msg_input').val("");
    }

    //extract method for notify
    function notify(tmpl, notify_type, event_type, data) {
        $.tmpl(tmpl, { "clientName": data.clientName,
            "notifyType": notify_type,
                "type": event_type})
                    .appendTo("#chat_content");

        $("#chat_content").animate({ scrollTop: $('#chat_content')[0].scrollHeight}, "fast");
    }

    //format date-time to needed style
    function getDateTime() {
        var today = new Date();
        var hours = today.getHours(); //returns 0-23
        var minutes = today.getMinutes(); //returns 0-59
        if (minutes < 10) {
            minutesString = 0 + minutes + ""; //+""casts minutes to a string.
        } else {
            minutesString = minutes;
        }
        return hours + ":" + minutesString;
    }

})(jQuery);