const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const joke = new Schema({
    setup: String,
    punchline: String
});

joke.methods.toString = function() {
    return this.setup + ", hours: " + this.punchline;
};

module.exports = mongoose.model('Joke', joke);