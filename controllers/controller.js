"use strict";

const Joke = require('../models/joke');
const RegistryURL = require('../config').jokeRegistry;
const fetch = require('node-fetch');

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
exports.deleteJoke = function (id) {
    return Joke.findOneAndDelete({_id : id}).exec();
};

exports.getOthersites = async function () {
   const response = await fetch('https://krdo-joke-registry.herokuapp.com/api/services');
   const result = await response.json();
   return result;
};

exports.getService = function (id) {
    return Service.findOne({_id : id}).exec();
};

exports.createService = function (name, address, secret) {
    const service = new Service({
        name,
        address,
        secret
    });
    return service.save();
};

exports.deleteService = function (address, secret) {
    return Service.findOneAndDelete({address: address, secret: secret}).exec();
};