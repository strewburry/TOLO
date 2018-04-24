'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {createAuthToken, localAuth, jwtAuth} = require('../util');
const router = express.Router(); 

router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
	const user = req.user;
	const token = createAuthToken(req.user.serialize());
	res.json({token, user});
});

router.post('/refresh', jwtAuth, (req, res) => {
	const token = createAuthToken(req.user); 
	res.json({token});
});

module.exports = {router}; 