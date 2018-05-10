function showSignUpForm() {
	$('.form-overlay').show().prop('hidden', false).html(TEMPLATES.signUpForm);
}

function showLogInForm() {
	$('.form-overlay').show().prop('hidden', false).html(TEMPLATES.logInForm);
}

function showAppInfo() {
	$('#app-info').show().prop('hidden', false);
	document.getElementById('app-info').scrollIntoView({behavior: 'instant', block: 'end', inline: 'nearest'});
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
			saveDataToLocalStorage(res); 
			isLoggedIn();
		})
		.fail(function(xhr, err) {
			let jsonResponse = JSON.parse(xhr.responseText);
			let errMessage = jsonResponse['message'];
			$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>${errMessage}</p></span>`);
		})
	}
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
		saveDataToLocalStorage(res);
		isLoggedIn();
	})
	.fail(function(xhr, err) {
		let errMessage = JSON.stringify(xhr.responseText);
		$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>${errMessage}</p></span>`);
	})
}

function saveDataToLocalStorage(res) {
	localStorage.setItem('token', res.token);
	localStorage.setItem('userId', res.user._id);
}

function isLoggedIn() {
	if(localStorage.getItem('userId')) {
		$('.messages-wrapper').show().prop('hidden', false);
		$('.intro').hide().prop('hidden', true);
		$('#app-info').hide().prop('hidden', true);
		$('.form-overlay').fadeToggle('fast').hide().prop('hidden', true);
		$('#navbar').html(TEMPLATES.loggedInLinks);
		getUserMessages();
	}
	else { 
		$('.intro').show().prop('hidden', false);
		$('.messages-wrapper').hide().prop('hidden', true);
		$('#navbar').html(TEMPLATES.loggedOutLinks);
	}
}

function logOut() {
	localStorage.removeItem('userId');
	localStorage.removeItem('token');
	$('.intro').show();
	$('.messages-wrapper').hide().prop('hidden', true);
	$('#navbar').html(TEMPLATES.loggedOutLinks);
}