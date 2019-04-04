const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const serviceRegistry = require('../config').jokeRegistry;

router
.get(serviceRegistry + '/api/services', (req, res) => {
    // Get services
})
.post(serviceRegistry + '/api/services', (req, res) => {
    // Post new jokeservice
})
.delete(serviceRegistry + '/api/services/:secret', (req, res) => {
    // Delete jokesite
});

module.exports = router;