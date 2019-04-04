const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const post = new Schema({
    setup: String,
    punchline: String
});

post.methods.toString = function() {
    return this.setup + ", hours: " + this.punchline;
};

module.exports = mongoose.model('Post', post);