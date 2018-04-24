'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken');
const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const {User} = require('../users');

const expect = chai.expect; 

chai.use(chaiHttp);

describe('user authentication endpoints', function() {
    const username = 'testUser';
    const password = 'testPassword';
    let id;

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {
        return User
        .hashPassword(password)
        .then(password => {
            User.create({
                username,
                password
            })
            .then(user => {
                id = user.id;
            });
        });
    })

    afterEach(function() {
        return User.remove({});
    });

    describe('login endpoint', function() {
        it('should reject empty requests', function() {
            return chai
            .request(app)
            .post('/api/auth/login')
            .then(res => {
                expect(res).to.have.status(400);
            });
        });

        it('should reject requests with invalid usernames', function() {
           return chai
           .request(app)
           .post('/api/auth/login')
           .send({
               username: 'invalidUser',
               password
           })
           .then(res => {
               expect(res).to.have.status(401);
           });
        });

        it('should reject requests with invalid passwords', function() {
            return chai
            .request(app)
            .post('/api/auth/login')
            .send({
                username,
                password: 'invalidPassword'
            })
            .then(res => {
                expect(res).to.have.status(401);
            });
        });

        it('should supply a valid JWT for a valid request', function() {
            return chai
            .request(app)
            .post('/api/auth/login')
            .send({
                username,
                password
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.token).to.be.a('string');
                const payload = jwt.verify(res.body.token, JWT_SECRET, {
                    algorithm: ['HS256']
                });
                expect(payload.user).to.deep.equal({
                    username,
                    id
                });
            });
        });
    });

    describe('JWT refresh', function() {
        it('should reject empty requests', function() {
            chai
            .request(app)
            .post('/api/auth/refresh')
            .then(res => {
                expect(res).to.have.status(401);
            });
        });

        it('should reject requests with an invalid token', function() {
            const authToken = jwt.sign(
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
            .post('/api/auth/refresh')
            .set('Authorization', `Bearer ${authToken}`)
            .then(res => {
                expect(res).to.have.status(401);
            });
        });

        it('should reject requests with expired token', function() {
            const authToken = jwt.sign(
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
            .post('/api/auth/refresh')
            .set('Authorization', `Bearer ${authToken}`)
            .then(res => {
                expect(res).to.have.status(401);
            });
        });

        it('should return a valid auth token with newer expiry date', function() {
            const authToken = jwt.sign(
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
            const decodedToken = jwt.decode(authToken);
            return chai
            .request(app)
            .post('/api/auth/refresh')
            .set('Authorization', `Bearer ${authToken}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.token).to.be.a('string');
                const payload = jwt.verify(authToken, JWT_SECRET, {
                    algorithm: ['HS256']
                });
                expect(payload.user).to.deep.equal({
                    username
                });
                expect(payload.exp).to.be.at.least(decodedToken.exp);
            });
        });
    });
});