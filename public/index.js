function appSetUp() {
	isLoggedIn();
	$('body').on('click', '#register, #signup-prompt', () => {
		showSignUpForm();
	})
	$('.popup__overlay').on('submit', '.signup', event => {
		handleUserSignUp(event);
	})
	$('body').on('click', '#login, #login-prompt', () => {
		showLogInForm();
	})
	$('.popup__overlay').on('submit', '.login', event => {
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
    $('.popup__overlay').on('submit', '#js-message', event => {
        handleSendMessage(event);
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

function showAppInfo() {
	TEMPLATES.showElement('.popup__overlay');
	$('.popup__overlay').html(TEMPLATES.appInfo).css('overflow', 'scroll').scrollTop();
	$('body').css('overflow', 'hidden');
}

function hideForm() {
    TEMPLATES.hideElement('.popup__overlay');
    $('body').css('overflow', 'auto');
}

$(appSetUp);