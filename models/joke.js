const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const joke = new Schema({
    setup: String,
    punchline: String
});

joke.methods.toString = function() {
    return "setup: " + this.setup + ", punchline: " + this.punchline;
};
//forbindelsen til mongoose how does it work, hvordan får den fanget tingene fra databasen, det samme spørgsmål med services
module.exports = mongoose.model('Joke', joke);