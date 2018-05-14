# TOLO 💌

![Take One, Leave One](https://s3.amazonaws.com/tolo-assets/HANDlogosmall.png "Take One, Leave One")

[TOLO](https://take-one-leave-one.herokuapp.com) is a full-stack web application that allows strangers to anonymously send and receive positive messages in a one-to-one exchange. Users write messages for strangers, and receive messages in return, which they can upvote, downvote, delete, or pass on to others. 

## Live App ⚡️

[https://take-one-leave-one.herokuapp.com](https://take-one-leave-one.herokuapp.com)

**demo username**: testuser  
**demo password**: testpassword  
_For best results, create your own account! TOLO only requires a username and password for registration, so sign-up is a breeze._

## Screencaps 📸

![TOLO Homepage](https://s3.amazonaws.com/tolo-assets/homescreen.png "TOLO Homepage")
_This is TOLO's homepage, where users can learn about the app, register, and log in._

![App summary](https://s3.amazonaws.com/tolo-assets/aboutscreen.png "App summary")
_This summary of the app appears when users click "what's this?" on the home page._

![Compose screen](https://s3.amazonaws.com/tolo-assets/composescreen.png "Compose screen")
_In order to receive messages, users must first compose a message. With a simple click of the "write message" button at the top right, this nifty form pops out to allow users to submit (and receive) as many messages as they like._

![Messages screen](https://s3.amazonaws.com/tolo-assets/messagesscreen.png "Messages screen")
_This is a collection of messages a user might receive on TOLO. On this page, users can view upvotes/downvotes, add their own vote (only one vote per message, please!), forward messages to other users, and delete messages entirely._

## Technologies & Tools Used 🛠

### Front end
* HTML5
* CSS3
* JavaScript ES6 
* jQuery

### Back end
* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport
* Bcrypt 
* JWT 

### Workflow
* Git
* NPM

### Testing and Deployment 
* aXe
* Mocha
* Chai/Chai-HTTP
* Faker
* Travis CI
* mLab
* Heroku

## RESTful API Endpoints 📍

### `/api/messages`

#### GET
returns all messages owned by request user

#### POST 
creates new message and returns a message that: 
* was not created by request user
* is not currently owned by another user 

#### PUT `/:id/forward` 
"forwards" message matching request id (relinquishes ownership of message, allowing another user to receive it)

#### PATCH `/:id/upvote`
upvotes message matching request id 

#### PATCH `/:id/downvote`
downvotes message matching request id

#### DELETE `/:id/`
deletes message matching request id 

### `/api/auth`

#### POST `/login`
logs user in and provides JSON web token 

### `/api/users`

#### POST 
registers new user

## Future Improvements 🔮
* updates to UI 
* rich text editing for messages