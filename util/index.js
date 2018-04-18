'use strict';
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const createAuthToken = function(user) {
	return jwt.sign({user}, JWT_SECRET, {
		subject: user.username, 
		expiresIn: JWT_EXPIRY, 
		algorithm: 'HS256'
	});
};

module.exports = {createAuthToken};