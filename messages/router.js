'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {DATABASE_URL, JWT_SECRET, PORT} = require('../config');
const {Message} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise; 

router.get('/', jsonParser, (req, res) => {
    Message
    .find()
    .then(messages => {
        res.status(200).send(messages);
    })
    .catch(err => {
        res.status(500).json({error: 'something went wrong'});
    })
})

router.post('/', jsonParser, (req, res) => {
    const requiredField = ['content'];
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
        res.status(500).json({error: 'something went wrong'});
    });
});

router.delete('/:id', (req, res) => {
    Message
    .findByIdAndRemove(req.params.id)
    .then(() => {
        res.status(204).json({message: 'deleted message successfully'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'could not delete message'});
    });
});

module.exports = {router};