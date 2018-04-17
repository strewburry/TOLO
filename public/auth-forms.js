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

function userSignUp() {
	$('body').on('click', '#register, .signup-prompt', event => {
		$('.form-overlay').show().prop('hidden', false);
		$('.form-overlay').html(signUpForm);
		closeForm();
	});
	$('.form-overlay').on('submit', '.signup', function(event) {
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
			};
			$.ajax({
				url: '/api/users',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(newUser)
			})
			.done(function(res) {
				localStorage.setItem('token', res.token);
				localStorage.setItem('userId', res.user._id);
				closeForm();
			})
			.fail(function(xhr, err) {
				let jsonResponse = JSON.parse(xhr.responseText);
				let errMessage = jsonResponse['message'];
				$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>${errMessage}</p></span>`);
			});
		}
	});
}

function closeForm() {
	$('.close').on('click', event => {
		$('.form-overlay').fadeToggle('fast').hide().prop('hidden', true);
	});
}

function userLogIn() {
	$('body').on('click', '.login-prompt', event => {
		$('.form-overlay').html(logInForm);
		closeForm();
	});
	$('.form-overlay').on('submit', '.login', function(event) {
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
			localStorage.setItem('token', res.token);
			localStorage.setItem('userId', res.user._id)
		})
		.fail(function(xhr, err) {
			let errMessage = JSON.stringify(xhr.responseText);
			$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>${errMessage}</p></span>`);
		});
	});
};

$(userSignUp);
$(userLogIn);