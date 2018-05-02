const TEMPLATES = (function(){
    const signUpForm = (`
				<div class="popupwrapper">
					<div class="popupcontent">
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
						<div class="popuptext">
							<p>Already have an account?</p>
						</div>
						<button class="login-prompt">log in</button>
					</div>
                </div>`);

    const logInForm = (`
			<div class="popupwrapper">
				<div class="popupcontent">
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
					<div class="popuptext">
						<p>Don't have an account?</p>
					</div>
					<button class="signup-prompt">sign up</button>
				</div>
			</div>`);

    const messageForm = (`
				<div class="popupwrapper">
					<div class="popupcontent">
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
					<li class="navItems"><button id="logout">log out</button></li>
					<li class="navItems"><button id="write">write message</button></li>
				</ul>`);

    const loggedOutLinks = (`
				<ul>
					<li id="logo" style="float:left;">TOLO</li>
					<li class="navitems">made with 💕 by <a href="https://www.github.com/strewburry">CB</a></li>
				</ul>`);

	const messageCard = (`
				<div class="popupwrapper">
					<div class="popupcontent">
						<a class="close">x</a>
						<h2>Thanks for your message!</h2>
						<p>It's sure to make someone's day. Here's one chosen just for you:</p>
						<div class="returned-message">
						</div>
						<button id="restart">Write another message!</button>
					</div>
				</div>`);
	const messageTemplate = (`
				<div class="message-card">
					<div class="content">
					<p>this is some text to test out the display</p> 
					</div>
					<div class="messageoptions">
					<div id="upvotecounter"></div>
					<div id="downvotecounter"></div>
					<button class="messagebutton" id="upvote"></button>
					<button class="messagebutton" id="downvote"></button>
					<button class="messagebutton" id="delete"></button> 
					<button class="messagebutton" id="forward"></button>
					</div>
				</div>`);
	const confirmDelete = (`
				<div class="popupwrapper">
					<div class="popupcontent">
					<a class="close">x</a>
					<h2>Are you sure you want to delete this message?</h2>
					<p>This action is permanent. You can always pass it on instead.</p>
					<button id="confirmdelete">I'm sure</button>
					<button class="cancel">I changed my mind</button>
					</div>
				</div>`); 
    return {
        signUpForm,
        logInForm,
        messageForm, 
        loggedInLinks,
		loggedOutLinks,
		messageCard,
		messageTemplate, 
		confirmDelete
    }
})()