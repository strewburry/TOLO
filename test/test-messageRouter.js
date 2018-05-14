'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {createAuthToken} = require('../util');
const {TEST_DATABASE_URL} = require('../config');
const {Message} = require('../messages');

mongoose.Promise = global.Promise; 

const expect = chai.expect;
chai.use(chaiHttp);

function seedMessageDb() {
    const seedMessages = [];
    for (let i = 1; i <= 50; i++) {
        seedMessages.push(generateMessages());
    }
    return Message.insertMany(seedMessages);
}

function generateMessages() {
    return {
        content: 'here is some test content',
        creatorId: uuidv4()
    }
}

function tearDownDb() {
    return mongoose.connection.dropDatabase();
}

describe('messages resource', function() {
    let testUser = {
        username: 'testUser',
        password: 'testPassword',
        id: uuidv4()
    };
    const token = createAuthToken(testUser);

    before(function() {
        return runServer(TEST_DATABASE_URL);
    })

    beforeEach(function() {
        return seedMessageDb();
    })

    afterEach(function() {
        return tearDownDb();
    })

    after(function() {
        return closeServer();
    })

    describe('POST endpoint', function() {
        it('should add new message to db', function() {
            const newMessage = generateMessages();
            return chai
            .request(app)
            .post('/api/messages')
            .send(newMessage)
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(201);
            })
        })

        it('should return a message from a different user', function() {
            let newMessage = generateMessages();
            newMessage.creatorId = testUser.id;
            return chai
            .request(app)
            .post('/api/messages')
            .send(newMessage)
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                const returnedMessage = res.body;
                expect(returnedMessage.creatorId).to.not.equal(newMessage.creatorId);
            })
        }) 

        it('should set `ownerId` on returned message', function() {
            let newMessage = generateMessages();
            newMessage.creatorId = testUser.id;
            return chai
            .request(app)
            .post('/api/messages')
            .send(newMessage)
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                const returnedMessage = res.body;
                expect(returnedMessage.ownerId).to.equal(newMessage.creatorId); 
            })
        })

        it('should throw an error if req body is missing content', function() {
           const invalidMessage = {};
           return chai
           .request(app)
           .post('/api/messages')
           .send(invalidMessage)
           .set('Authorization', `Bearer ${token}`)
           .then(res => {
               expect(res).to.have.status(400);
           })
        })
    })

    describe('GET endpoint', function() {
        it('should return all messages matching a single `ownerId`', function() {
            return chai
            .request(app)
            .get('/api/messages')
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
            })
        })
    })

    describe('DELETE endpoint', function() {
        it('should delete messages with valid ID', function() {
            let id; 
            return Message
            .findOne()
            .then(res => {
                res.ownerId = testUser.id;
                res.save(); 
                id = res._id;
                return chai
                .request(app)
                .delete(`/api/messages/${id}`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(res => {
                expect(res).to.have.status(204);
                return Message
                .findById(id);
            })
            .then(res => {
                expect(res).to.be.null;
            })
        })

        it('should throw an error if req user does not own message', function() {
            let id; 
            return Message
            .findOne()
            .then(res => {
                id = res._id; 
                return chai
                .request(app)
                .delete(`/api/messages/${id}`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(res => {
                expect(res).to.have.status(403);
            })
        })
    })

    describe('PUT endpoint', function() {
        it('should reset `ownerId` of a message with valid ID', function() {
            let id; 
            return Message 
            .findOne()
            .then(res => {
                id = res._id; 
                return chai
                .request(app)
                .put(`/api/messages/${id}/forward`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(res => {
                expect(res).to.have.status(204);
                return Message
                .findById(id);
            })
            .then(message => {
                expect(message.ownerId).to.be.null; 
            })
        })
    })

    describe('PATCH endpoint', function() {
        it('should upvote a message', function() {
            let id; 
            let voteScore; 
            return Message
            .findOne()
            .then(res => {
                id = res._id;
                voteScore = res.voteScore;
                return chai
                .request(app)
                .patch(`/api/messages/${id}/upvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(res => {
                expect(res).to.have.status(200); 
                expect(res.body.message.voteScore).to.equal(voteScore + 1); 
            })
        })

        it('should add user ids to `upvoted`', function() {
            let id; 
            return Message
            .findOne()
            .then(res => {
                id = res._id; 
                return chai
                .request(app)
                .patch(`/api/messages/${id}/upvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(() => {
                return Message
                .findById(id)
            })
            .then(message => {
                expect(message.upvoted).to.not.be.null; 
                expect(message.upvoted).to.be.a('array');
                expect(message.upvoted).to.include(testUser.id);
            })
        })

        it('should throw an error on upvote request if user has already upvoted', function() {
            let id; 
            return Message
            .findOne()
            .then(res => {
                id = res._id; 
                return chai
                .request(app)
                .patch(`/api/messages/${id}/upvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(() => {
                return Message
                .findById(id)
            })
            .then(() => {
                return chai
                .request(app)
                .patch(`/api/messages/${id}/upvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(res => {
                expect(res).to.have.status(400);
            })
        })

        it('should downvote a message', function() {
            let id; 
            let voteScore; 
            return Message
            .findOne()
            .then(res => {
                id = res._id; 
                voteScore = res.voteScore; 
                return chai
                .request(app)
                .patch(`/api/messages/${id}/downvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.message.voteScore).to.equal(voteScore - 1); 
            })
        })

        it('should add user ids to `downvoted`', function() {
            let id; 
            return Message
            .findOne()
            .then(res => {
                id = res._id; 
                return chai
                .request(app)
                .patch(`/api/messages/${id}/downvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(() => {
                return Message
                .findById(id)
            })
            .then(message => {
                expect(message.downvoted).to.not.be.null; 
                expect(message.downvoted).to.be.a('array');
                expect(message.downvoted).to.include(testUser.id);
            })
        })

        it('should throw an error on downvote request if user has already downvoted', function() {
            let id;
            return Message
            .findOne()
            .then(res => {
                id = res._id; 
                return chai
                .request(app)
                .patch(`/api/messages/${id}/downvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(() => {
                return Message
                .findById(id)
            })
            .then(() => {
                return chai
                .request(app)
                .patch(`/api/messages/${id}/downvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(res => {
                expect(res).to.have.status(400);
            })
        })

        it('should remove user id from `upvoted` if user changes their vote', function() {
            let id; 
            return Message
            .findOne()
            .then(res => {
                id = res._id; 
                return chai
                .request(app)
                .patch(`/api/messages/${id}/upvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(() => {
                return Message
                .findById(id)
            })
            .then(message => {
                expect(message.upvoted).to.include(testUser.id);
            })
            .then(() => {
                return chai
                .request(app)
                .patch(`/api/messages/${id}/downvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(() => {
                return Message
                .findById(id)
            })
            .then(message => {
                expect(message.upvoted).to.not.include(testUser.id);
                expect(message.downvoted).to.include(testUser.id);
            })
        })

        it('should remove user id from `downvoted` if user changes their vote', function() {
            let id; 
            return Message
            .findOne()
            .then(res => {
                id = res._id; 
                return chai
                .request(app)
                .patch(`/api/messages/${id}/downvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(() => {
                return Message
                .findById(id)
            })
            .then(message => {
                expect(message.downvoted).to.include(testUser.id);
            })
            .then(() => {
                return chai
                .request(app)
                .patch(`/api/messages/${id}/upvote`)
                .set('authorization', `Bearer ${token}`)
            })
            .then(() => {
                return Message
                .findById(id)
            })
            .then(message => {
                expect(message.downvoted).to.not.include(testUser.id);
                expect(message.upvoted).to.include(testUser.id);
            })
        })
    })
})