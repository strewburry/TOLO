'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const {DATABASE_URL, PORT} = require('../config');
const {Message} = require('./models');
const router = express.Router();
mongoose.Promise = global.Promise; 

router.get('/', jsonParser, (req, res) => {
    Message
    .count()
    .exec((err, count) => {
        const random = Math.floor(Math.random() * count);
        Message
        .findOne()
        .skip(random)
        .exec((err, result) => {
            res.json(result.serialize())
            if (err) {
                res.status(500).json({error: 'something went wrong'});
            };
        });
    });
});

router.post('/', jsonParser, (req, res) => {
    const requiredField = ['content', 'creatorId'];
    if (!requiredField in req.body) {
        res.status(400).json({error: 'message content cannot be empty'});
    };
    Message 
    .create({
        content: req.body.content,
        creatorId: req.body.creatorId
    })
    .then(message => {
        res.status(201).json(message.serialize());
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'something went wrong'});
    });
});

module.exports = {router};