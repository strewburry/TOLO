'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const app = express();

const {PORT, DATABASE_URL, TEST_DATABASE_URL} = require('./config');
const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const {router: messageRouter} = require('./messages');

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	next();
});

app.use(morgan('dev'));
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

let server;

function runServer(databaseUrl) {
	return new Promise((resolve, reject) => { 
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err); 
			}
			server = app
			.listen(PORT, () => {
				console.log(`Your app is listening on port ${PORT}`);
				resolve(); 
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
};

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
};

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};