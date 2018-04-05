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

function getMessage(callback) {
	setTimeout(function(){callback(MOCK_MESSAGES)}, 1);
}

function displayMessage(data) {
	let index = Math.floor(Math.random() * data.messages.length);
	let message = data.messages[index].text;
	$('body').append('<p>' + message + '</p>');
}
function getAndDisplayMessage() {
	getMessage(displayMessage);
}

$(function() {
	getAndDisplayMessage();
})