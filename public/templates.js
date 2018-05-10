const TEMPLATES = (function(){
    const signUpForm = (`
				<div class="popup-wrapper">
					<div class="popup-content">
						<a class="close">x</a>
						<h2>sign up</h2>
						<div class="warning" aria-live="assertive" style="display:none;" hidden></div>
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
						<div class="popup-text">
							<p>Already have an account?</p>
						</div>
						<button class="login-prompt">log in</button>
					</div>
                </div>`);

    const logInForm = (`
			<div class="popup-wrapper">
				<div class="popup-content">
					<a class="close">x</a>
					<h2>log in</h2>
					<div class="warning" aria-live="assertive" style="display:none;" hidden></div>
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
					<div class="popup-text">
						<p>Don't have an account?</p>
					</div>
					<button class="signup-prompt">sign up</button>
				</div>
			</div>`);

    const messageForm = (`
				<div class="popup-wrapper">
					<div class="popup-content">
						<a class="close">x</a>
						<h2>Write a Message</h2>
						<div class="warning" aria-live="assertive" style="display:none;" hidden></div>
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
					<li class="nav-items"><button id="logout">log out</button></li>
					<li class="nav-items"><button id="write">write message</button></li>
				</ul>`);

    const loggedOutLinks = (`
				<ul>
					<li id="logo" style="float:left;">TOLO</li>
					<li class="nav-items">made with 💕 by <a href="https://www.github.com/strewburry">CB</a></li>
				</ul>`);

	const noMessagesTemplate = (`
				<div class="no-message-text">
					<h1>No messages here, sorry!</h1>
					<p>Once you write a message, more will show up here.<p>
				</div>`);

	const messageTemplate = (message) => (`
				<div class="message-card" id="${message._id}">
					<div class="content">
						<p>${message.content}</p> 
					</div>
					<div class="message-options" data-id="${message._id}">
						<div id="vote-counter">${message.voteScore}</div>
						<button class="message-button" id="upvote"></button>
						<button class="message-button" id="downvote"></button>
						<button class="message-button" id="delete"></button>
						<button class="message-button" id="forward"></button>
					</div>
				</div>`);

	const confirmDelete = (id) => (`
				<div class="popup-wrapper">
					<div class="popup-content">
					<a class="close">x</a>
					<h2>Delete this message?</h2>
					<p>This action is permanent. You can always pass it on to another user instead.</p>
					<button data-id="${id}" id="confirm-delete">I'm sure</button>
					<button class="cancel">I changed my mind</button>
					</div>
				</div>`);

	const confirmForward = (id) => (`
				<div class="popup-wrapper">
					<div class="popup-content">
					<a class="close">x</a>
					<h2>Forward this message?</h2>
					<p>This message will no longer belong to you, and you will no longer see it in your received messages...
					but it will make someone else's day!</p>
					<button data-id="${id}" id="confirm-forward">I'm sure</button>
					<button class="cancel">I changed my mind</button>
					</div>
				</div>`);

    return {
        signUpForm,
        logInForm,
        messageForm, 
        loggedInLinks,
		loggedOutLinks,
		noMessagesTemplate,
		messageTemplate, 
		confirmDelete,
		confirmForward
    }
})()