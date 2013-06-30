(function ($) {
    var serverAddress = 'http://127.0.0.1:5055',
        socket        = null;

    var notification_tmpl = '<div class="notification" id="notification_content">';
        notification_tmpl += '<span class="notification_style">';
            notification_tmpl += '<span class="notification_name">"${clientName}"</span> has joined the room.';
        notification_tmpl += '</span>';
    notification_tmpl += '</div>';

    socket =  io.connect(serverAddress);

    //focus on client key name and press enter then submit to server
    $('#clientName').keypress(function(event){
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
                $('.nano').nanoScroller({});
            }, 700); // 1 second

            //everything ready and send data to server
            socket.emit('addNewUser', { 'clientName' :  $('#clientName').val() });

            console.debug('emit data to server clientName is ' + $('#clientName').val());
        }
    });

    socket.on('notification', function(data) {

        console.debug('notification is coming with clientName is ' + data.clientName);

        $.tmpl( notification_tmpl, { "clientName" : data.clientName } )
                .appendTo( "#chat_content" );
    });

})(jQuery);