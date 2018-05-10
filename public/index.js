function appSetUp() {
	isLoggedIn();
	$('body').on('click', '#register, .signup-prompt', () => {
		showSignUpForm();
	})
	$('.form-overlay').on('submit', '.signup', function(event) {
		handleUserSignUp(event);
	})
	$('body').on('click', '#login, .login-prompt', () => {
		showLogInForm();
	})
	$('.form-overlay').on('submit', '.login', event => {
		handleUserLogIn(event);
	})
	$('body').on('click', '.close, .cancel', () => {
		hideForm(); 
	})
	$('body').on('click', '#about', () => {
		showAppInfo();
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
	$('body').on('click', '#delete', event => {
		const id = event.target.parentElement.getAttribute('data-id');
		showConfirmDelete(id); 
	})
	$('body').on('click', '#confirm-delete', event => {
		const id = event.target.getAttribute('data-id'); 
		deleteMessage(id); 
	})
	$('body').on('click', '#forward', event => {
		const id = event.target.parentElement.getAttribute('data-id');
		showConfirmForward(id);
	})
	$('body').on('click', '#confirm-forward', event => {
		const id = event.target.getAttribute('data-id');
		forwardMessage(id);
	})
	$('body').on('click', '#upvote', event => {
		const id = event.target.parentElement.getAttribute('data-id');
		upvoteMessage(id);
	})
	$('body').on('click', '#downvote', event => {
		const id = event.target.parentElement.getAttribute('data-id');
		downvoteMessage(id);
	})
}

$(appSetUp);