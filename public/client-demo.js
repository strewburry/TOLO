const demoForm = (`
			<div class="popupwrapper">
				<div class="popupcontent">
					<a class="close">x</a>
					<h2>Try It Out</h2>
					<div class="warning" aria-live="assertive" style="display:none;" hidden></div>
					<form id="js-demo">
						<label for="input">
							<p>Write a thoughtful, positive message or affirmation for a stranger:</p>
						</label>
						<textarea type="text" name="input" class="js-demo-input" form="js-demo" placeholder="Positive words only!"></textarea>
						<button type="submit">Send your message!</button>
					</form>
				</div>
			</div>`);

const MOCK_MESSAGES = {
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
	let message = data.messages[index].content;
	$('.form-overlay').html(`
					<div class="popupwrapper">
						<div class="popupcontent">
							<a class="close">x</a>
							<h1>🌸🌷🌿🌺🌼🍀🌻💐🍃</h1>
							<h3>Thanks for your message!</h3>
							<p>It's sure to make someone's day. Here's one chosen just for you:</p>
							<div class="message-card">
								<p>${message}</p>
							</div>
						<button id="restart">Write another message!</button>
					</div>
				</div>`);
	handleRestart(); 
	closeForm();
};

function getAndDisplayMessage() {
	getMessage(displayMessage);
};

function closeForm() {
	$('.close').on('click', event => {
		$('.form-overlay').fadeToggle('fast').hide().prop('hidden', true);
	})
}

function demoSetUp() {
	$('#trydemo').on('click', event => {
		$('.form-overlay').show().prop('hidden', false);
		$('.form-overlay').html(demoForm);
		closeForm();
	});
	$('.form-overlay').on('submit', '#js-demo', function(event) {
		event.preventDefault();
		const messageTarget = $('.js-demo-input');
		messageTarget.val("");
		getAndDisplayMessage();
	});
};

function handleRestart() {
	$('#restart').on('click', event => {
		$('.form-overlay').html(demoForm);
		demoSetUp();
		closeForm();
	});
};

$(demoSetUp);