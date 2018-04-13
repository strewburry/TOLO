'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

mongoose.Promise = global.Promise; 

let MessageSchema = new Schema({
    creatorId: {
        type: String,
        required: true
    }, 
    holderId: String,
    messageId: String, 
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
        content: this.content, 
        upvotes: this.upvotes,
        downvotes: this.downvotes
    };
};

let Message = mongoose.model('Message', MessageSchema);
module.exports = {Message};