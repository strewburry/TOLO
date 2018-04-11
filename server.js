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

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(morgan('common'));
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/dashboard', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

let server;

function runServer() {
	return new Promise((resolve, reject) => { 
		mongoose.connect(DATABASE_URL, err => {
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
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};