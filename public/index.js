function appSetUp() {
	isLoggedIn();
	$('body').on('click', '#register, .signup-prompt', () => {
		showSignUpForm();
	})
	$('.form-overlay').on('submit', '.signup', function(event) {
		handleUserSignUp(event);
	})
	$('body').on('click', '.close', event => {
		closeForm(event);
	})
	$('body').on('click', '.login-prompt', () => {
		showLogInForm();
	})
	$('.form-overlay').on('submit', '.login', event => {
		handleUserLogIn(event);
	})
	$('body').on('click', '#write', () => {
		showMessageForm();
    })
    $('.form-overlay').on('submit', '#js-message', event => {
        handleSendMessage(event);
	})
	$('.form-overlay').on('click', '#restart', () => {
		showMessageForm();
	})
	$('body').on('click', '#logout', () => {
		logOut();
	})
	$('body').on('click', '#upvote', () => {
		handleUpvote(event); 
	})
	$('body').on('click', '#delete', event => {
		deleteMessage(event); 
	})
}

$(appSetUp);