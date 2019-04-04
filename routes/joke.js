const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();

router
    .get('/', (req, res) => {
        controller.getJokes()
            .then(val => res.json(val))
            .catch(err => {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    })
    .post('/', (req, res) => {
        const {setup, punchline} = req.body;
        controller.createJoke(setup, punchline)
            .then(() => res.json({message: 'Joke saved!'}))
            .catch(err => {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    });

module.exports = router;