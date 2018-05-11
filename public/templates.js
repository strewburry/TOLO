const TEMPLATES = (function(){
    const signUpForm = (`
				<div class="popup__wrapper">
					<div class="popup__content">
						<a class="close">x</a>
						<h2>sign up</h2>
						<div class="popup__text--warning" aria-live="assertive" style="display:none;" hidden></div>
						<form class="signup" method="post">
							<label for="username">
								Create a username:
							</label>
							<input type="text" name="username" placeholder="can include letters and numbers" pattern="[a-zA-Z0-9]+">
							<label for="password">
								Set a password:
							</label>
							<input type="password" name="password" placeholder="password">
							<label for="confirmpass">
								Confirm your password: 
							</label>
							<input type="password" name="confirmpass" placeholder="confirm password">
							<button type="submit">register</button>
						</form>
						<div class="popup__text">
							<p>Already have an account?</p>
						</div>
						<button class="button button--color-yellow" id="login-prompt">log in</button>
					</div>
                </div>`);

    const logInForm = (`
			<div class="popup__wrapper">
				<div class="popup__content">
					<a class="close">x</a>
					<h2>log in</h2>
					<div class="popup__text--warning" aria-live="assertive" style="display:none;" hidden></div>
					<form class="login" method="post">
						<label for="username">
							Username:
						</label>
						<input type="text" name="username" placeholder="username">
						<label for="password">
							Password:
						</label>
						<input type="password" name="password" placeholder="password">
						<button type="submit">log in</button>
					</form>
					<div class="popup__text">
						<p>Don't have an account?</p>
					</div>
					<button class="button button--color-yellow" id="signup-prompt">sign up</button>
				</div>
			</div>`);

	const appInfo = (`
				<div class="popup__wrapper">
					<div class="popup__content">
						<a class="close">x</a>
							<h2>About TOLO</h2>
							<p>TOLO is a free service where strangers can exchange positive messages.</p>
							<div class="quote">
								<p>“Like take a penny, leave a penny, but for kindness”</p>
								<span class="quote__attribution">
								-<a href="https://github.com/strewburry">CB</a>, who made this app with ❤️
								</span> 
							</div> 
							<h2>How It Works</h2>
							<h3>Write</h3>
							<p>Write a kind message for a stranger. It could be:</p>
							<ul>
								<li>a positive affirmation</li>
								<li>a short poem</li>
								<li>a compliment</li>
								<li>an inspiring quote</li>
								<li>a word of advice</li>
								<li>anything you want, as long as it's positive!</li>
							</ul>
							<p>They won't know who sent it, but it's sure to make their day.</p>
							<h3>Receive</h3>
							<p>Once you submit your message, you'll receive a message from a stranger in return.
							This message is unique, and will only be sent to you, unless you decide to pass it on.</p>
							<h3>Pay it forward</h3>
							<p>All the messages you receive will be stored for you to upvote or downvote, read and
							cherish, and pass on to someone else whenever you're ready.</p>
						</div>
					</div>`);

    const messageForm = (`
				<div class="popup__wrapper">
					<div class="popup__content">
						<a class="close">x</a>
						<h2>Write a Message</h2>
						<div class="popup__text--warning" aria-live="assertive" style="display:none;" hidden></div>
						<form id="js-message">
							<label for="input">
								<p>Write a thoughtful, positive message or affirmation for a stranger:</p>
							</label>
							<textarea type="text" name="input" class="js-message-input" form="js-message" placeholder="Positive words only!"></textarea>
							<button type="submit">Send your message!</button>
						</form>
					</div>
				</div>`);

    const loggedInLinks = (`
				<ul>
					<li id="logo" style="float:left;">TOLO</li>
					<li class="nav-items"><button class="button button--color-yellow" id="logout">log out</button></li>
					<li class="nav-items"><button class="button button--color-orange" id="write">write message</button></li>
				</ul>`);

	const noMessagesTemplate = (`
				<div class="no-message-text">
					<h1>No messages here, sorry!</h1>
					<p>Once you write a message, more will show up here.<p>
				</div>`);

	const messageTemplate = (message) => (`
				<div class="message__card" id="${message._id}">
					<div class="message__votes" data-id="${message._id}">
						<button class="message__vote" id="upvote"></button>
						<div class="vote__counter">${message.voteScore}</div>
						<button class="message__vote" id="downvote"></button>
					</div> 
					<div class="message__content">
						<p>${message.content}</p> 
					</div>
					<div class="message__options" data-id="${message._id}">
						<button class="message__action" id="forward"></button>
						<button class="message__action" id="delete"></button>
					</div>
				</div>`); 

	const confirmDelete = (id) => (`
				<div class="popup__wrapper">
					<div class="popup__content">
					<a class="close">x</a>
					<h2>Delete this message?</h2>
					<p>This action is permanent. You can always pass it on to another user instead.</p>
					<button data-id="${id}" class="button button--color-yellow" id="confirm-delete">I'm sure</button>
					<button class="button button--color-orange cancel">I changed my mind</button>
					</div>
				</div>`);

	const confirmForward = (id) => (`
				<div class="popup__wrapper">
					<div class="popup__content">
					<a class="close">x</a>
					<h2>Forward this message?</h2>
					<p>This message will no longer belong to you, and you will no longer see it in your received messages...
					but it will make someone else's day!</p>
					<button data-id="${id}" class="button button--color-yellow" id="confirm-forward">I'm sure</button>
					<button class="button button--color-orange cancel">I changed my mind</button>
					</div>
				</div>`);

	const hideElement = (element) => $(element).hide().prop('hidden', true); 

	const showElement = (element) => $(element).show().prop('hidden', false); 

    return {
        signUpForm,
		logInForm,
		appInfo, 
        messageForm, 
        loggedInLinks,
		noMessagesTemplate,
		messageTemplate, 
		confirmDelete,
		confirmForward,
		hideElement,
		showElement
    }
})()