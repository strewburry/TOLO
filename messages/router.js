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
router.use(jwtAuth);

router.get('/', (req, res) => {
    Message
    .find({'ownerId': req.user.id})
    .then(messages => {
        res.status(200).send(messages);
    })
    .catch(err => {
        res.status(500).json({error: 'something went wrong'});
    })
})

router.post('/', (req, res) => {
    const requiredField = ['content'];
    if (!(requiredField in req.body)) {
        return res.status(400).json({error: 'message content cannot be empty'});
    }
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
        })
    })
})

router.put('/:id/forward', (req, res) => {
    Message
    .findByIdAndUpdate(req.params.id, {ownerId: null}, {new: true})
    .then(() => {
        res.status(204).end(); 
    })
    .catch(err => {
        res.status(500).json({error: err});
    })
})

router.patch('/:id/upvote', (req, res) => {
    Message
    .findById(req.params.id)
    .then(message => {
        const alreadyUpvoted = message.upvoted.includes(req.user.id);
        if (alreadyUpvoted) {
            return res.status(400).json({error: 'cannot vote the same way twice'});
        }
        const alreadyDownvoted = message.downvoted.includes(req.user.id);
        if (alreadyDownvoted) {
            let _downvoted = message.downvoted.filter(id => id !== req.user.id);
            message.downvoted = _downvoted; 
        }
        message.voteScore++; 
        message.upvoted.push(req.user.id);
        message.save()
        .then(message => {
            return res.status(200).json({message});
        })
    })
    .catch(err => {
        res.status(500).json({error: err});
    }) 
})

router.patch('/:id/downvote', (req, res) => {
    Message
    .findById(req.params.id)
    .then(message => {
        const alreadyDownvoted = message.downvoted.includes(req.user.id); 
        if (alreadyDownvoted) {
            return res.status(400).json({error: 'cannot vote the same way twice'});
        }
        const alreadyUpvoted = message.upvoted.includes(req.user.id);
        if (alreadyUpvoted) {
            let _upvoted = message.upvoted.filter(id => id !== req.user.id);
            message.upvoted = _upvoted; 
        }
        message.voteScore--; 
        message.downvoted.push(req.user.id);
        message.save()
        .then(message => {
            return res.status(200).json({message});
        }) 
    })
    .catch(err => {
        res.status(500).json({error: err});
    })
})

router.delete('/:id', (req, res) => {
    Message
    .findById(req.params.id)
    .then(message => {
        if (message.ownerId !== req.user.id) {
            res.status(403).json({error: 'user must own this message to delete'});
        }
        return message.remove()
        .then(() => {
            res.status(204).json({message: 'deleted message successfully'});
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
    })
})

module.exports = {router};