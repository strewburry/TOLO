function showSignUpForm() {
	$('.form-overlay').show().prop('hidden', false);
	$('.form-overlay').html(TEMPLATES.signUpForm);
}

function handleUserSignUp(event) {
	event.preventDefault();
	const username = $('[name=username]').val();
	const password = $('[name=password]').val();
	const passwordConf = $('[name=confirmpass]').val();
	if (password !== passwordConf) {
		$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>Passwords must match</p></span>`);
	} else {
		const newUser = {
			username: username,
			password: password, 
			passwordConf: passwordConf
		}
		$.ajax({
			url: '/api/users',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(newUser)
		})
		.done(function(res) {
			localStorage.setItem('token', res.token);
			localStorage.setItem('userId', res.user._id);
			isLoggedIn();
		})
		.fail(function(xhr, err) {
			let jsonResponse = JSON.parse(xhr.responseText);
			let errMessage = jsonResponse['message'];
			$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>${errMessage}</p></span>`);
		})
	}
}

function closeForm() {
	$('.form-overlay').fadeToggle('fast').hide().prop('hidden', true);
}

function showLogInForm() {
	$('.form-overlay').html(TEMPLATES.logInForm);
}

function handleUserLogIn(event) {
	event.preventDefault();
	const username = $('[name=username]').val();
	const password = $('[name=password]').val();
	const logInCreds = {
		username: username, 
		password: password
	}
	$.ajax({
		url: '/api/auth/login',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(logInCreds)
	})
	.done(function(res) {
		localStorage.setItem('token', res.token);
		localStorage.setItem('userId', res.user._id);
		localStorage.setItem('receivedMessages', res.user.receivedMessages);
		isLoggedIn();
	})
	.fail(function(xhr, err) {
		let errMessage = JSON.stringify(xhr.responseText);
		$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>${errMessage}</p></span>`);
	})
}

function isLoggedIn() {
	if(localStorage.getItem('userId')) {
		$('.introwrapper').hide();
		$('.form-overlay').fadeToggle('fast').hide().prop('hidden', true);
		$('#navbar').html(TEMPLATES.loggedInLinks);
	}
}

function logOut() {
	localStorage.removeItem('userId');
	localStorage.removeItem('token');
	localStorage.removeItem('receivedMessages');
	$('.introwrapper').show();
	$('#navbar').html(TEMPLATES.loggedOutLinks);
}