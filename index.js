// 连接数据库
require('./tools/connect.js');
// 引入body-parser
var bodyParser = require('body-parser');
// 引入session
var session = require('express-session');

// 获得 Model
var PaintModel = require('./model/paintModel');
var UserModel = require('./model/userModel');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// 配置模板 EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// 配置 session
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'yujing'
}));

app.get('/mdn', function(req, res) {
    res.redirect('/mdn.html');
});

app.get('/paint', function(req, res) {
    res.render('paint.ejs', { dataURI: '', username: req.session.username, paintuser: req.session.paintuser });
    /*PaintModel.findOne({}, function(err, data) {
        if (!err) {
            var dataURI = 'data:,';
            if (data) {
                dataURI = data.dataURI;
            }
            res.render('paint.ejs', { dataURI: dataURI, username: req.session.username, paintuser: req.session.paintuser });
        }
    });*/
});

app.post('/quit', function(req, res) {
    UserModel.updateOne({ username: req.session.username }, { $set: { isLogin: false, isPaint: false } }, function(err) {
        if (!err) {
            req.session.username = '';
            res.send({});
        }
    });
});

app.post('/checkName', function(req, res) {
    var username = req.body.username;
    UserModel.findOne({ username: username }, function(err, data) {
        if (!err) {
            if (data != null) {
                res.send({ state: 'exist' });
            } else {
                res.send({ state: 'ok' });
            }
        }
    });
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == '' || password == '') {
        res.send({ state: 'null' });
        return;
    }
    UserModel.findOne({ username: username }, function(err, data) {
        if (!err) {
            if (data != null) {
                if (data.password == password) {
                    if (!data.isLogin) {
                        UserModel.updateOne({ username: username }, { $set: { isLogin: true } }, function(err) {
                            if (!err) {
                                UserModel.findOne({ isPaint: true }, function(err, data) {
                                    if (!err) {
                                        if (data != null) {
                                            req.session.paintuser = data.username;
                                            req.session.username = username;
                                            res.send({ state: 'ok', session: req.session, user: data });
                                            return;
                                        } else {
                                            UserModel.updateOne({ username: username }, { $set: { isPaint: true } }, function(err) {
                                                if (!err) {
                                                    req.session.paintuser = username;
                                                    req.session.username = username;
                                                    res.send({ state: 'ok', session: req.session, user: data });
                                                    return;
                                                }
                                            });
                                        }
                                    } else {
                                        console.log(err);
                                        res.send({ state: 'error' });
                                    }
                                });
                            }
                        });
                    } else {
                        res.send({ state: 'isLogin' });
                        return;
                    }
                } else {
                    res.send({ state: 'perror' });
                    return;
                }

            } else {
                UserModel.create({
                    username: username,
                    password: password
                }, function(err, data) {
                    if (!err) {
                        UserModel.findOne({ isPaint: true }, function(err, data) {
                            if (!err) {
                                if (data != null) {
                                    req.session.paintuser = data.username;
                                    req.session.username = username;
                                    res.send({ state: 'ok', session: req.session, user: data });
                                    return;
                                } else {
                                    UserModel.updateOne({ username: username }, { $set: { isPaint: true } }, function(err) {
                                        if (!err) {
                                            req.session.paintuser = username;
                                            req.session.username = username;
                                            res.send({ state: 'ok', session: req.session, user: data });
                                            return;
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        console.log(err);
                        res.send({ state: 'error' });
                    }
                });
            }
        }
    });

});

app.post('/saveDataURI', function(req, res) {
    var dataURI = req.body.dataURI;
    PaintModel.remove({});
    PaintModel.create({ dataURI: dataURI }, function(err) {
        if (!err) {}
    });
});

app.get('/getDataURI', function(req, res) {
    PaintModel.findOne({}, function(err, data) {
        if (!err) {
            var dataURI = 'data:,';
            if (data) {
                dataURI = data.dataURI;
            }
            res.send({ dataURI: dataURI });
        }
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('dataURI', function (dataURI) {
        console.log('发送数据');
      socket.emit('dataURI', dataURI);
      socket.broadcast.emit('dataURI', dataURI);
    });
});

server.listen(3000, function() {
    console.log('App listening on port 3000!');
});