# Take One, Leave One (TOLO)

![Take One, Leave One](https://s3.amazonaws.com/tolo-assets/HANDlogosmall.png "Take One, Leave One")

TOLO is an app that utilizes RESTful API architecture to allow users to exchange positive messages in a one-to-one exchange. Users write messages for strangers, and receive messages in return, which they can upvote, downvote, delete, or pass on to others. 

## Live URL

[https://take-one-leave-one.herokuapp.com](https://take-one-leave-one.herokuapp.com)

**demo username**: testuser
**demo password**: testpassword
_For best results, create your own account! TOLO only requires a username and password for registration, so sign-up is a breeze._

## Screens

![TOLO Homepage](https://s3.amazonaws.com/tolo-assets/homescreen.png "TOLO Homepage")
_This is TOLO's homepage, where users can learn about the app, register, and log in._

![App summary](https://s3.amazonaws.com/tolo-assets/aboutscreen.png "App summary")
_This summary of the app appears when users click "what's this?" on the home page._

![Compose screen](https://s3.amazonaws.com/tolo-assets/composescreen.png "Compose screen")
_In order to receive messages, users must first compose a message. With a simple click of the "write message" button at the top right, this nifty form pops out to allow users to submit (and receive) as many messages as they like._

![Messages screen](https://s3.amazonaws.com/tolo-assets/messagesscreen.png "Messages screen")
_This is a collection of messages a user might receive on TOLO. On this page, users can view upvotes/downvotes, add their own vote (only one vote per message, please!), forward messages to other users, and delete messages entirely._

## Technologies Used

### Front end
* HTML5
* CSS3
* ES6 
* jQuery

### Back end
* Node.js
* Express.js
* MongoDB
* Mongoose
* mLab

### Workflow
* Git
* NPM
* Travis CI 
* Heroku

### Testing
* Mocha
* Chai
* Chai-HTTP

## RESTful API Endpoints

### `/api/messages`

#### GET
returns all messages owned by request user

#### POST 
creates new message and returns a message that: 
* was not created by request user
* is not currently owned by another user 

#### PUT `/:id/forward` 
relinquishes ownership of message matching request id, allowing another user to receive it 

#### PATCH `/:id/upvote`
increments the vote score of message matching request id by 1

#### PATCH `/:id/downvote`
decrements the vote score of message matching request id by 1

#### DELETE `/:id/`
deletes message with request id 

### `/api/auth`

#### POST `/login`
logs user in and provides JSON web token 

### `/api/users`

#### POST 
registers new user

#### GET `/:id`
returns user matching request id