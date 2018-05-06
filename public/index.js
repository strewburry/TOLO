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
	$('body').on('click', '#delete', event => {
		const id = event.target.parentElement.getAttribute('data-id');
		showConfirmDelete(id); 
	})
	$('body').on('click', '#confirmdelete', event => {
		const id = event.target.getAttribute('data-id'); 
		deleteMessage(id); 
	})
	$('body').on('click', '#forward', event => {
		const id = event.target.parentElement.getAttribute('data-id');
		showConfirmForward(id);
	})
	$('body').on('click', '#confirmforward', event => {
		const id = event.target.getAttribute('data-id');
		forwardMessage(id);
	})
	$('body').on('click', '.cancel', () => {
		closeForm(); 
	})
	$('body').on('click', '#upvote, #downvote', event => {
		const id = event.target.parentElement.getAttribute('data-id');
		voteMessage(id);
	})
}

$(appSetUp);