$(function () {
    $('#chatList').scrollTop(10000);

    $('#sendChatContent').click(function (ev) {
        sendChatcontent();
    });

    $('#chatContent').keydown(function (ev) {
        ev = ev || event;
        if(ev.keyCode === 13){
            ev.preventDefault();
        }
    });

    $('#chatContent').keyup(function (ev) {
        ev = ev || event;
        if(ev.keyCode === 13){
            sendChatcontent();
        }
    });

    function sendChatcontent() {
        var username = $('#username').text();
        var chatContent = $('#chatContent').val().trim();
        if(!chatContent){
            return;
        }
        if(socket){
            socket.emit('chat', {username: username, chatContent: chatContent});
        }
        $('#chatContent').val('');
    }
});