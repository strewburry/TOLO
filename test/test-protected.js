'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const {User} = require('../users');

const expect = chai.expect;

chai.use(chaiHttp); 

describe('protected endpoints', function() {
    const username = 'testUser';
    const password = 'testPassword'; 

    before(function () {
        return runServer(TEST_DATABASE_URL);
    })

    after(function() {
        return closeServer();
    })

    beforeEach(function() {
        return User
        .hashPassword(password)
        .then(password => {
            User.create({
                username, 
                password
            })
        })
    })

    afterEach(function() {
        return User.remove({});
    })

    describe('protected message endpoints', function() {
        it('should reject unauthorized requests', function() {
            return chai
            .request(app)
            .get('/api/messages')
            .then(res => {
                expect(res).to.have.status(401);
            })
        })

        it('should reject requests with invalid JWT', function() {
            const token = jwt.sign(
                {
                    username, 
                    password
                }, 
                'notTheRightSecret',
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );
            return chai
            .request(app)
            .get('/api/messages')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(401);
            })
        })

        it('should reject requests with an expired JWT', function() {
            const token = jwt.sign(
                {
                    username, 
                    password
                }, 
                JWT_SECRET, 
                {
                    algorithm: 'HS256',
                    expiresIn: Math.floor(Date.now() / 1000) - 15
                }
            );
            return chai
            .request(app)
            .get('/api/messages')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(401);
            })
        })

        it('should send protected data upon valid request', function() {
            const token = jwt.sign(
                {
                    user: {
                        username
                    }
                }, 
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );
            return chai
            .request(app)
            .get('/api/messages')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(200);
            })
        })
    })
})