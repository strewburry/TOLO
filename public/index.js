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
	$('body').on('click', '#logout', () => {
		logOut();
	})
}

$(appSetUp);