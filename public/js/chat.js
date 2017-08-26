$(function () {
    $('#chatList').scrollTop(10000);

    $('#sendChatContent').click(function (ev) {
        var username = $('#username').text();
        var chatContent = $('#chatContent').val().trim();
        if(!chatContent){
            return;
        }
        if(socket){
            socket.emit('chat', {username: username, chatContent: chatContent});
        }
        $('#chatContent').val('');
    });
});