var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/paint', { useMongoClient: true });
mongoose.connection.once('open', function(err) {
    if (!err) {
        console.log('mongodb connected');
    }
});