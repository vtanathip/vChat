(function ($) {
    var serverAddress = 'http://127.0.0.1:5055',
        socket        = null;

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
            }, 700); // 1 second

            //everything ready and send data to server
            //socket.emit('addNewUser', { 'clientName' :  $('#clientName').val() });
        }
    });

})(jQuery);