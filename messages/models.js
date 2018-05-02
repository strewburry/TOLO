'use strict';
const mongoose = require('mongoose');
const {User} = require('../users');
const Schema = mongoose.Schema; 

mongoose.Promise = global.Promise; 

let MessageSchema = new Schema({
    creatorId: String,
    ownerId: {
        type: String,
        default: null
    },
    content: {
        type: String, 
        required: true
    }, 
    upvotes: {
        type: Number, 
        default: 0
    },
    downvotes: {
        type: Number, 
        default: 0
    }
});

MessageSchema.methods.serialize = function() {
    return {
        id: this._id,
        creatorId: this.creatorId,
        ownerId: this.ownerId,
        content: this.content, 
        upvotes: this.upvotes,
        downvotes: this.downvotes
    };
};

let Message = mongoose.model('Message', MessageSchema);
module.exports = {Message};