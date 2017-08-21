$(function() {

    // $('#username').blur(function() {
    //     $.post('/checkName', { username: $('#username').val() },
    //         function(data) {
    //             if (data.state == 'ok') {
    //                 $('#errMsg').html('√');
    //                 $('#errMsg').css('color', 'green');
    //             } else {
    //                 $('#errMsg').html('用户名已存在');
    //                 $('#errMsg').css('color', 'red');
    //             }
    //         });
    // });

    $('#userinfo').delegate('#login', 'click', function() {
        // if ($('#errMsg').html() != '√') {
        //     return;
        // }
        var username = $('#username').val();
        var password = $('#password').val();
        if (username == '' || password == '') {
            $('#errMsg').html('用户名或密码不能为空');
            $('#errMsg').css('color', 'red');
            return;
        }
        $.post('/login', { username: username, password: password },
            function(data) {
                if (data.state == 'ok') {
                    $('#userinfo').html('<button id="quit">退出</button> <br> <p>用户名：<span id="username">' + username + '</span></p> <br> <p>当前作画用户：<span>' + data.session.paintuser + '</span></p>')
                    socket = io.connect('http://192.168.11.43:3000');
                    if (data.session.paintuser != data.session.username) {
                        isPaint = false;
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        $('#nowpaint').html(data.session.paintuser);
                        $('#now').css('display', 'block');
                        var image;
                        setTimeout(function() {
                            socket.on('dataURI', function(dataURI) {
                                console.log('接受到数据');
                                image = new Image();
                                image.src = dataURI;
                                image.onload = function() {
                                    context.clearRect(0, 0, canvas.width, canvas.height);
                                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                                }
                            });
                        }, 0);

                    } else {
                        isPaint = true;
                        $('#nowpaint').html(data.session.username);
                        $('#now').css('display', 'none');
                    }
                } else if (data.state == 'null') {
                    $('#errMsg').html('用户名或密码不能为空');
                    $('#errMsg').css('color', 'red');
                } else if (data.state == 'isLogin') {
                    $('#errMsg').html('该用户已登录');
                    $('#errMsg').css('color', 'red');
                    return;
                } else if (data.state == 'perror') {
                    $('#errMsg').html('密码错误');
                    $('#errMsg').css('color', 'red');
                    return;
                }
            }
        );
    });

    $('#userinfo').delegate('#quit', 'click', function() {
        $.post('/quit', function() {
            $('#userinfo').html('<p id="notLogin"><span id="errMsg"></span> [未登录]</p><form><label>用户名：</label><input type="text" name="username" id="username" required /><br><label>密码：</label><input type="password" name="password" id="password" required /><button type="button" id="login">登录</button></form>');
            isPaint = true;
            socket.disconnect();
            url = '';
        });
    });

    $(window).unload(function() {
        $.post('/quit', function() {
            $('#userinfo').html('<p id="notLogin"><span id="errMsg"></span> [未登录]</p><form><label>用户名：</label><input type="text" name="username" id="username" required /><br><label>密码：</label><input type="password" name="password" id="password" required /><button type="button" id="login">登录</button></form>');
        });
    });
});