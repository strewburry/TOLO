'use strict';
const mongoose = require('mongoose');
const {User} = require('../users');
const Schema = mongoose.Schema; 

mongoose.Promise = global.Promise; 

let MessageSchema = new Schema({
    creatorId: String,
    holderId: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
    content: {
        type: String, 
        required: true
    }, 
    upvotes: Number,
    downvotes: Number
});

MessageSchema.methods.serialize = function() {
    return {
        id: this._id,
        creatorId: this.creatorId,
        holderId: this.holderId,
        content: this.content, 
        upvotes: this.upvotes,
        downvotes: this.downvotes
    };
};

let Message = mongoose.model('Message', MessageSchema);
module.exports = {Message};