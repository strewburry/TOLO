'use strict';
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});

const createAuthToken = function(user) {
	return jwt.sign({user}, JWT_SECRET, {
		subject: user.username, 
		expiresIn: JWT_EXPIRY, 
		algorithm: 'HS256'
	});
};

module.exports = {createAuthToken, localAuth, jwtAuth};