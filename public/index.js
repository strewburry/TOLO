var MOCK_MESSAGES = {
	"messages": [
		{
			"creatorId": "111111",
			"holderId": null, 
			"content": "You are too big a gift to waste your time on sadness.",
			"upvotes": 0,
			"downvotes": 0
		},
		{
			"creatorId": "222222",
			"holderId": null,
			"content": "Many people look up to you and recognize your worth! " +
			"You are admired!",
			"upvotes": 0,
			"downvotes": 0
		},
		{
			"creatorId": "333333",
			"holderId": null, 
			"content": "I'm so proud of you, and I hope you are proud of " +
			"yourself, too! It hasn't been easy, but you're doing so well. ",
			"upvotes": 0,
			"downvotes": 0
		},
		{
			"creatorId": "444444",
			"holderId": null,
			"content": "There are better things ahead! All that you need " +
			"comes to you at the right time and place in your life.",
			"upvotes": 0,
			"downvotes": 0
		}
	]
};

function getMessage(callback) {
	setTimeout(function(){callback(MOCK_MESSAGES)}, 1);
};

function displayMessage(data) {
	let index = Math.floor(Math.random() * data.messages.length);
	let message = data.messages[index].text;
	$('.demo').prop('hidden', true);
	$('.js-message-result').html(`<h3>Thanks for your message!</h3>
		<p>🌸🌷🌿🌺🌼🍀🌻💐🍃</p>
		<p>You're sure to make someone's day. 
		<br>Here's one chosen just for you:</p>
		<div class="message-card">
		<p>${message}</p>
		</div>
		<p><button id="restart">Write another message!</button></p>`).prop('hidden', false);
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
	$('#trydemo').on('click', event => {
		$('.demo').prop('hidden', false);
		$('.js-message-result').html('').prop('hidden', true)
	});
};

function handleRestart() {
	$('#restart').on('click', event => {
		$('.demo').prop('hidden', false);
		$('.js-message-result').html('').prop('hidden', true);
		appSetUp();
	});
};

$(appSetUp);