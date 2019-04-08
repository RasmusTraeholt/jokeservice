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

exports.editJoke = function(id, setup, punchline) {
    return Joke.findOneAndUpdate(
        {_id : id}, 
        {setup : setup, punchline : punchline}, 
        {new : true}).exec();
};

exports.getOthersites = async function () {
   const response = await fetch(RegistryURL + '/api/services');
   const json = await response.json();
   return json;
};

exports.getOtherSiteJokes = async function (id) {
    const allSites = await fetch(RegistryURL + '/api/services');
    const allSitesJSON = await allSites.json();
    const result = allSitesJSON.find(site => site._id == id);
    let url = result.address;
    const regex = /\/$/;
    if (!regex.test(url)) {
        url += '/';
    }
    console.log(result);
    const response = await fetch(url + 'api/jokes');
    const json = await response.json();
    return json;
}

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