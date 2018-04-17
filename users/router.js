'use strict'; 
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('./models');
const {createAuthToken} = require('../util');
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['username', 'password', 'passwordConf'];
	const missingField = requiredFields.find(field => !(field in req.body));
	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Field cannot be blank',
			location: missingField
		});
	};

	const sizedFields = {
		username: {
			min: 1
		},
		password: {
			min: 10,
			max: 72
		}
	};
	const tooShortField = Object.keys(sizedFields).find(field =>
		'min' in sizedFields[field] &&
			req.body[field].trim().length < sizedFields[field].min);
	const tooLongField = Object.keys(sizedFields).find(field => 
		'max' in sizedFields[field] &&
			req.body[field].trim().length > sizedFields[field].max);
	if (tooShortField || tooLongField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError', 
			message: tooShortField
				? `${tooShortField} must be at least ${sizedFields[tooShortField].min}
				characters long`
				: `${tooLongField} must be at most ${sizedFields[tooLongField].max}
				characters long`,
			location: tooShortField || tooLongField
		});
	}

	const explicitlyTrimmedFields = ['username', 'password'];
	const nonTrimmedField = explicitlyTrimmedFields.find(field => 
		req.body[field].trim() !== req.body[field]
	); 
	if (nonTrimmedField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Field cannot start or end with whitespace',
			location: nonTrimmedField
		});
	}

	let {username, password, passwordConf} = req.body;
	return User.find({username})
	.count()
	.then(count => {
		if (count > 0) {
			return Promise.reject({
				code: 422,
				reason: 'ValidationError',
				message: 'Username already exists',
				location: 'username'
			});
		}
		return User.hashPassword(password);
	})
	.then(hash => {
		return User.create({
			username, 
			password: hash
		});
	})
	.then(user => {
		const token = createAuthToken(user.serialize());
		return res.status(201).json({token, user});
	})
	.catch(err => {
		if (err.reason === 'ValidationError') {
			return res.status(err.code).json(err);
		}
		res.status(500).json({code: 500, message: 'internal server error'})
	});
});

module.exports = {router};