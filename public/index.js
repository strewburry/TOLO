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
		// const id = $(event.target).parent().data('id');
		const id = event.target.parentElement.getAttribute('data-id');
		showConfirmDelete(id); 
	})
	$('body').on('click', '#confirmdelete', event => {
		const id = event.target.getAttribute('data-id'); 
		deleteMessage(id); 
    })
}

$(appSetUp);