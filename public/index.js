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
};

function displayMessage(data) {
	let index = Math.floor(Math.random() * data.messages.length);
	let message = data.messages[index].text;
	$('.input').prop('hidden', true);
	$('.js-message-result').html(`<h3>Thanks for your message!</h3>
		<p>You're sure to make someone's day. 
		<br>Here's one chosen just for you:</p>
		<div class="message-card">
		<p>${message}</p>
		<p>🌸🌷🌿🌺🌼🍀🌻💐🍃</p>
		</div>
		<p><button id="restart">Write another message!</button></p>
		<p>Or make an account to save and review your messages!</p>`).prop('hidden', false);
	handleRestart(); 
};

function getAndDisplayMessage() {
	getMessage(displayMessage);
};


function appSetUp() {
	$('#js-message-input').submit(event => {
		event.preventDefault();
		const messageTarget = $('.js-input');
		let newMessage = messageTarget.val();
		messageTarget.val("");
		getAndDisplayMessage();
	});
}

function handleRestart() {
	$('#restart').on('click', event => {
		$('.input').prop('hidden', false);
		$('.js-message-result').html('').prop('hidden', true);
		appSetUp();
	});
}

$(appSetUp);