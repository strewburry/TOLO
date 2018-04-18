'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {createAuthToken} = require('../util');
const router = express.Router(); 

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());
router.post('/login', localAuth, (req, res) => {
	const user = req.user;
	const token = createAuthToken(req.user.serialize());
	res.json({token, user});
});

const jwtAuth = passport.authenticate('jwt', {session: false});
router.post('/refresh', jwtAuth, (req, res) => {
	const token = createAuthToken(req.user); 
	res.json({token});
});

router.get('/', jwtAuth, (req, res) => {
	res.json("success!");
});

module.exports = {router}; 