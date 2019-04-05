const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();

router
    .get('/jokes', (req, res) => {
        // Get own jokes
        controller.getJokes()
            .then(val => res.json(val))
            .catch(err => {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    })
    .post('/jokes', (req, res) => {
        // Create new joke to own db
        const {setup, punchline} = req.body;
        controller.createJoke(setup, punchline)
            .then(() => res.json({message: 'Joke saved!'}))
            .catch(err => {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    })
    .get('/jokes/:id', (req, res) => {
        // Get specific own joke
        controller.getJoke(req.params.id)
        .then(val => res.json(val))
        .catch(err => {
            console.log("Error: " + err);
            if(err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
    })
    .post('/jokes/:id', (req, res) => {
        // Edit own joke
    })
    .get('/othersite', (req, res) => {
        // Get other services
    })
    .get('/otherjokes/:site', (req, res) => {
        // Get jokes from specific service
    })
    .delete('/jokes/:id', (req, res) => {
        // Delete own joke
    });

module.exports = router;