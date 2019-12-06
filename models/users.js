let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
        name: String,
        password: String
    },
    { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);
