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
    return Joke.findOne({ _id: id }).exec();
};

// Returns a promise that resolves with an array of all jokes
exports.getJokes = function () {
    return Joke.find().exec();
};

// Returns a promise that resolves when a joke is found and deleted with specified id
exports.deleteJoke = function (id) {
    return Joke.findOneAndDelete({ _id: id }).exec();
};

// Function to edit a Joke with new setup and punchline through specific id
exports.editJoke = function (id, setup, punchline) {
    return Joke.findOneAndUpdate(
        { _id: id },
        { setup: setup, punchline: punchline },
        { new: true }).exec();
};

// Function to post new joke to selected Site. expexted return: json with the deleted joke.
exports.postJokeToSite = async function(id, setup, punchline) {
    try {
        const data = {setup: setup, punchline: punchline};
        const site = await exports.findService(id);
        const response = await fetch(exports.checkUrl(site.address) + 'api/jokes/', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

// Function to post a joke to another Site. Expected return: json with the updated joke.
exports.editOtherSiteJoke = async function(siteid, id, setup, punchline) {
    try {
        const data = {setup: setup, punchline: punchline};
        const site = await exports.findService(siteid);
        const response = await fetch(exports.checkUrl(site.address) + 'api/jokes/' + id, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

// Returns JSON with all registered services from RegistryURL
exports.getOthersites = async function () {
    const response = await fetch(RegistryURL + '/api/services');
    const json = await response.json();
    return json;
};

// returns JSON with jokes from other site through id
exports.getOtherSiteJokes = async function (id) {
    const site = await exports.findService(id);
    const response = await fetch(exports.checkUrl(site.address) + 'api/jokes');
    const json = await response.json();
    return json;
};

// delete a joke from selected site. Expected return: json with the deleted joke
exports.deleteOtherSiteJoke = async function(siteid, id) {
    try {
        const site = await exports.findService(siteid);
        const response = await fetch(exports.checkUrl(site.address) + 'api/jokes/' + id, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        })
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

// returns site found with id
exports.findService = async function(id) {
    const sites = await exports.getOthersites();
    const site = sites.find(site => site._id == id);
    return site;
};

// deletes a service from https://krdo-joke-registry.herokuapp.com/api/services and returns the deleted site
exports.deleteService = async function (address, secret) {
    const data = { address: address, secret: secret };
    const response = await fetch('https://krdo-joke-registry.herokuapp.com/api/services', {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
    const json = await response.json();
    return json;
};

// returns a string with a new url, where it has been tested if the original url has / at the end or not
exports.checkUrl = function(url) {
    const regex = /\/$/;
    if (!regex.test(url)) {
        url += '/';
    }
    return url
};