var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.11.43:27017/paint', { useMongoClient: true });
mongoose.connection.once('open', function(err) {
    if (!err) {
        console.log('mongodb connected');
    }
});