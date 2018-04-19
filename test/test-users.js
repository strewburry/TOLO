'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const {User} = require('../users'); 

const expect = chai.expect;

chai.use(chaiHttp); 

describe('users API', function() {
	const username = 'testUser';
	const password = 'testPassword';
	const passwordConf = password;
	let id;
	let createdMessages;
	let receivedMessages;

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer(); 
	});

	beforeEach(function() {
	});

	afterEach(function() {
		return User.remove({});
	});

	describe('users router', function() {
		describe('POST endpoint', function() {
			it('should reject form submissions with missing usernames', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					password,
					passwordConf
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Field cannot be blank');
					expect(res.body.location).to.equal('username');
				});
			}); 
			it('should reject form submissions with missing passwords', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					username, 
					passwordConf
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Field cannot be blank');
					expect(res.body.location).to.equal('password');
				});
			});
			it('should reject form submissions missing password confirmations', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					username,
					password
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Field cannot be blank');
					expect(res.body.location).to.equal('passwordConf');
				});
			});
			it('should reject form submissions with empty usernames', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					username: '',
					password,
					passwordConf
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('username must be at least 1\n\t\t\t\tcharacters long');
					expect(res.body.location).to.equal('username');
				});
			});
			it('should reject form submissions with passwords under 10 characters', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					username, 
					password: 'pass',
					passwordConf: 'pass'
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('password must be at least 10\n\t\t\t\tcharacters long');
					expect(res.body.location).to.equal('password');
				});
			});
			it('should reject form submissions with passwords over 72 characters', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					username, 
					password: 'kpndoljqelnwfmiycnzyibtcmiyfuquvsntkbhpnethymbdrkkfjhtkbqskgpbmosftmgsikb',
					passwordConf: 'kpndoljqelnwfmiycnzyibtcmiyfuquvsntkbhpnethymbdrkkfjhtkbqskgpbmosftmgsikb'
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('password must be at most 72\n\t\t\t\tcharacters long');
					expect(res.body.location).to.equal('password');
				});
			});
			it('should reject form submissions with non-trimmed usernames', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					username: `  ${username}  `,
					password,
					passwordConf
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Field cannot start or end with whitespace');
					expect(res.body.location).to.equal('username');
				});
			});
			it('should reject form submissions with non-trimmed passwords', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					username, 
					password: `  ${password}  `,
					passwordConf: `  ${password}  `
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Field cannot start or end with whitespace');
					expect(res.body.location).to.equal('password');
				});
			});
			it('should create a new user', function() {
				return chai
				.request(app)
				.post('/api/users')
				.send({
					username, 
					password,
					passwordConf
				})
				.then(res => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.an('object');
					expect(res.body.token).to.be.a('string');
					const payload = jwt.verify(res.body.token, JWT_SECRET, {
						algorithm: ['HS256']
					});
					id = payload.user.id; 
					createdMessages = payload.user.createdMessages;
					receivedMessages = payload.user.receivedMessages;
					expect(payload.user).to.deep.equal({
						username, 
						id,
						createdMessages,
						receivedMessages
					});
					return User.findOne({
						username
					});
				})
				.then(user => {
					expect(user).to.not.be.null;
					return user.validatePassword(password);
				})
				.then((validPassword) => {
					expect(validPassword).to.be.true;
				});
			});
			it('should reject form submissions if user already exists', function() {
				return User.create({
					username, 
					password,
					passwordConf
				})
				.then(() => {
					return chai
					.request(app)
					.post('/api/users')
					.send({
						username, 
						password,
						passwordConf
					}) 
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res.body.reason).to.equal('ValidationError');
					expect(res.body.message).to.equal('Username already exists');
					expect(res.body.location).to.equal('username');
				});
			});
		});
	});
});