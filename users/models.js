'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const {Message} = require('../messages');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise; 

let UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	receivedMessages: [{
		type: Schema.Types.ObjectId,
		ref: 'Message'
	}]
});

UserSchema.methods.serialize = function() {
  return {
		username: this.username || '', 
		id: this._id, 
		receivedMessages: this.receivedMessages
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

let User = mongoose.model('User', UserSchema);
module.exports = {User};