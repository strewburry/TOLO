'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {DATABASE_URL, JWT_SECRET, PORT} = require('../config');
const {jwtAuth} = require('../util');
const {Message} = require('./models');

const router = express.Router();

mongoose.Promise = global.Promise; 

router.use(bodyParser.json());

router.get('/', jwtAuth, (req, res) => {
    Message
    .find({'ownerId': req.user.id})
    .then(messages => {
        res.status(200).send(messages);
    })
    .catch(err => {
        res.status(500).json({error: 'something went wrong'});
    })
})

router.post('/', jwtAuth, (req, res) => {
    const requiredField = ['content'];
    if (!(requiredField in req.body)) {
        return res.status(400).json({error: 'message content cannot be empty'});
    };
    // add message to the database
    Message 
    .create({
        content: req.body.content,
        creatorId: req.body.creatorId
    })
    // return message not created by the same user
    .then(newMessage => {
        return Message
        .findOne({'creatorId': {$ne: newMessage.creatorId}, ownerId: null})
        // set `ownerId` property on the received message to match the user to receive it
        .then(receivedMessage => {
            receivedMessage.ownerId = newMessage.creatorId;
            return receivedMessage.save();
        })
        // send back received message with updated `ownerId` property 
        .then(receivedMessage => {
            res.status(201).json(receivedMessage.serialize());
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
    });
});

router.delete('/:id', jwtAuth, (req, res) => {
    Message
    .findByIdAndRemove(req.params.id)
    .then(() => {
        res.status(204).json({message: 'deleted message successfully'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: err});
    });
});

module.exports = {router};