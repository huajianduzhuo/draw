var mongoose = require('mongoose');
var PaintSchema = new mongoose.Schema({
    dataURI: String
});
var PaintModel = mongoose.model('paint', PaintSchema);
module.exports = PaintModel;