var MOCK_MESSAGES = {
	"messages": [
		{
			"id": "1111",
			"text": "i know you can do this!",
			"userId": "aaaaaa",
			"userName": "Smiley Face"
		},
		{
			"id": "222222",
			"text": "many people look up to you and recognize your worth! " +
			"you are admired!",
			"userId": "bbbbbb",
			"userName": "Posi Pal"
		},
		{
			"id": "333333",
			"text": "i'm so proud of you, and i hope you are proud of " +
			"yourself, too! it hasn't been easy, but you're doing so well. " +
			"i love you, keep it up!",
			"userId": "cccccc",
			"userName": "Stay Positive"
		},
		{
			"id": "444444",
			"text": "there are better things ahead!", 
			"userId": "dddddd",
			"userName": "Sunshine"
		}
	]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getMessage(callback) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){callback(MOCK_MESSAGES)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayMessage(data) {
	let index = Math.floor(Math.random() * data.messages.length);
	let message = data.messages[index].text;
	$('body').append('<p>' + message + '</p>');
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayMessage() {
	getMessage(displayMessage);
}

//  on page load do this
$(function() {
	getAndDisplayMessage();
})