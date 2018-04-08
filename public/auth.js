const signUpForm = (`
				<div class="popupwrapper">
					<div class="popupcontent">
						<a class="close">x</a>
							<h2>sign up</h2>
						<div class="warning" aria-live="assertive" style="display:none;" hidden></div>
						<form class="signup">
							<label for="username">
								create a username:
							</label>
							<input type="text" name="username" placeholder="username">
							<label for="password">
								set a password:
							</label>
							<input type="password" name="password" placeholder="password">
							<label for="confirmpass">
								confirm your password: 
							</label>
							<input type="password" name="confirmpass" placeholder="confirm password">
							<button type="submit">register</button>
						</form>
						<div class="popuptext">
							<p>already have an account?</p>
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
					<form class="login">
						<label for="username">
							username:
						</label>
						<input type="text" name="username" placeholder="username">
						<label for="password">
							password:
						</label>
						<input type="password" name="password" placeholder="password">
						<button type="submit">log in</button>
					</form>
					<div class="popuptext">
						<p>don't have an account?</p>
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
	$('.signup').submit(event => {
		event.preventDefault();
		const username = $('[name=username]').val();
		const password = $('[name=password]').val();
		const passwordConf = $('[name=confirmpass]').val();
		if (password !== passwordConf) {
			$('.warning').show().prop('hidden', false);
			$('.warning').text('passwords must match!');
		} else {
			const newUser = {
				username: username,
				password: password
			};
		};
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
};

$(userSignUp);
$(userLogIn);