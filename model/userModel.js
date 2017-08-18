var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    isLogin: {
        type: Boolean,
        default: true
    },
    isPaint: {
        type: Boolean,
        default: false
    }
});
var UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;