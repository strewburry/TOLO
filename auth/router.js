'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {createAuthToken} = require('../util');
const router = express.Router(); 

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());
router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user.serialize());
	res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});
router.post('/refresh', jwtAuth, (req, res) => {
	const authToken = createAuthToken(req.user); 
	res.json({authToken});
});

router.get('/', jwtAuth, (req, res) => {
	res.json("success!");
});

module.exports = {router}; 