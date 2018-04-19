'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Message} = require('../messages');

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
        content: 'here is some test content'
    };
};

function tearDownDb() {
    return mongoose.connection.dropDatabase();
};

describe('messages', function() {
    
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
        it('should add a message to the main database', function() {
            const newMessage = generateMessages();
            return chai
            .request(app)
            .post('/api/messages')
            .send(newMessage)
            .then(res => {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body.content).to.equal(newMessage.content);
                return Message.findById(res.body.id);
            })
            .then(message => {
                expect(message.content).to.equal(newMessage.content);
            });
        });
        
        it('should throw an error if req body is missing content', function() {
           const invalidMessage = {};
           return chai
           .request(app)
           .post('/api/messages')
           .send(invalidMessage)
           .catch(res => {
               expect(res).to.have.status(400);
           });
        });
    });

    describe('GET endpoint', function() {
        it('should return a random message from the main database', function() {
            return chai
            .request(app)
            .get('/api/messages')
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