function showSignUpForm() {
	TEMPLATES.showElement('.popup__overlay');
	$('.popup__overlay').html(TEMPLATES.signUpForm);
}

function showLogInForm() {
	TEMPLATES.showElement('.popup__overlay');
	$('.popup__overlay').html(TEMPLATES.logInForm);
}

function handleUserSignUp(event) {
	event.preventDefault();
	const username = $('[name=username]').val();
	const password = $('[name=password]').val();
	const passwordConf = $('[name=confirmpass]').val();
	if (password !== passwordConf) {
		TEMPLATES.showElement('.popup__text--warning');
		$('.popup__text--warning').html(`<p>Passwords must match</p>`);
	} else {
		const newUser = {
			username: username,
			password: password, 
			passwordConf: passwordConf
		};
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
			TEMPLATES.showElement('.popup__text--warning');
			$('.popup__text--warning').html(`<p>${errMessage}</p>`);
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
	};
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
		TEMPLATES.showElement('.popup__text--warning'); 
		$('.popup__text--warning').html(`<p>${errMessage}</p>`);
	})
}

function saveDataToLocalStorage(res) {
	localStorage.setItem('token', res.token);
	localStorage.setItem('userId', res.user._id);
}

function isLoggedIn() {
	if(localStorage.getItem('userId')) {
		TEMPLATES.showElement('#navbar');
		TEMPLATES.showElement('.messages__wrapper');
		TEMPLATES.hideElement('.intro'); 
		TEMPLATES.hideElement('.popup__overlay'); 
		$('#navbar').html(TEMPLATES.loggedInLinks);
		getUserMessages(); 
	}
	else { 
		TEMPLATES.showElement('.intro');
		TEMPLATES.hideElement('.messages__wrapper');
	}
}

function logOut() {
	localStorage.removeItem('userId');
	localStorage.removeItem('token');
	TEMPLATES.showElement('.intro');
	TEMPLATES.hideElement('#navbar'); 
	TEMPLATES.hideElement('.messages__wrapper');
} 