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
    for (let i = 1; i <= 10; i++) {
        seedMessages.push(generateMessages());
    }
    return Message.insertMany(seedMessages);
};

function generateMessages() {
    return {
        content: 'here is some test content',
        creatorId: uuidv4()
    };
};

function tearDownDb() {
    return mongoose.connection.dropDatabase();
};

describe('messages resource', function() {
    let testUser = {
        username: 'testUser',
        password: 'testPassword'
    };
    const token = createAuthToken(testUser);

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedMessageDb();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

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
            const newMessage = generateMessages();
            return chai
            .request(app)
            .post('/api/messages')
            .send(newMessage)
            .set('authorization', `Bearer ${token}`)
            .then(newMessage => {
                return Message.findOne({creatorId: {$ne: newMessage.creatorId}, ownerId: null})
            })
            .then(messageToReturn => {
                expect(messageToReturn.ownerId).to.be.null; 
                expect(messageToReturn.creatorId).to.not.equal(newMessage.creatorId);
            })
        }) 

        it('should update the `ownerId` property on returned message to match the req user', function() {
            const newMessage = generateMessages();
            return chai
            .request(app)
            .post('/api/messages')
            .send(newMessage)
            .set('authorization', `Bearer ${token}`)
            .then(newMessage => {
                return Message.findOne({creatorId: {$ne: newMessage.creatorId}, ownerId: null})
            })
            .then(messageToReturn => {
                messageToReturn.ownerId = newMessage.creatorId; 
                return messageToReturn.save(); 
            })
            .then(messageToReturn => {
                expect(messageToReturn.ownerId).to.not.be.null; 
            })
        })
        
        /* it('should throw an error if req body is missing content', function() {
           const invalidMessage = {};
           return chai
           .request(app)
           .post('/api/messages')
           .send(invalidMessage)
           .set('authorizaton', `Bearer ${token}`)
           .catch(res => {
               expect(res).to.have.status(400);
           });
        }); */ 
    }); 

    describe('GET endpoint', function() {
        it('should return all messages matching a single ownerId', function() {
            return chai
            .request(app)
            .get('/api/messages')
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
            });
        });
    });

    describe('DELETE endpoint', function() {
        it('should delete messages with valid ID', function() {
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
                expect(res).to.have.status(204);
                return Message
                .findById(id);
            })
            .then(res => {
                expect(res).to.be.null;
            })
        });
    });
})