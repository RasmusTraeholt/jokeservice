const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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
            .then(result => res.json({message: 'Joke saved!', joke: result}))
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
            //res.sendStatus(404); Not found!
            res.status(500).send(err);
        });
    })
    .put('/jokes/:id', (req, res) => {
        // Edit own joke
        const {setup, punchline} = req.body;
        controller.editJoke(req.params.id, setup, punchline)
        .then(result => res.json({message: 'Joke edited!', joke: result}))
            .catch(err => {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    })
    .get('/othersites', (req, res) => {
        // Get other jokeservices
        controller.getOthersites()
        .then(result => res.json(result))
        .catch(err => {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
    })
    .get('/otherjokes/:site', (req, res) => {
        // Get jokes from specific service
    })
    .delete('/jokes/:id', (req, res) => {
        controller.deleteJoke(req.params.id)
        .then(result => res.json({message: 'Joke deleted!', joke: result}))
        .catch(err => {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
    });

module.exports = router;