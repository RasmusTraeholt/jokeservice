"use strict";

const Joke = require('../models/Joke');

// Returns a promise that resolves when the joke is created
exports.createJoke = function (setup, punchline) {
    const joke = new Joke({
        setup,
        punchline
    });
    return joke.save();
};

// Returns a promise that resolves when a joke is found with the specified id
exports.getJoke = function (id) {
    return Joke.findOne({_id: id}).exec();
};

// Returns a promise that resolves with an array of all jokes
exports.getJokes = function () {
    return Joke.find().exec();
};

// Returns a promise that resolves when a joke is found and deleted with specified id
exports.deleteJoke = function () {
    return Joke.findOneAndDelete({_id : id}).exec();
}