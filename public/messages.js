function showMessageForm() {
	$('.form-overlay').show().prop('hidden', false).html(TEMPLATES.messageForm);
}

function hideForm() {
    $('.form-overlay').fadeToggle('fast').hide().prop('hidden', true);
}

function getUserMessages() {
    $.ajax({
        url: '/api/messages',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(userMessages => {
        STORE.messages = userMessages;
        renderMessages();
    })
}

function renderMessages() {
    if (STORE.messages.length < 1) {
        $('.messages-wrapper').html(TEMPLATES.noMessagesTemplate).show().prop('hidden', false);
    } else {
    let userMessageCards = STORE.messages.map(message => {
        return TEMPLATES.messageTemplate(message);
    });
    $('.messages-wrapper').html(userMessageCards).show().prop('hidden', false);
    }
}

function handleSendMessage(event) {
    event.preventDefault();
    const content = $('[name=input]').val();
    const creatorId = localStorage.getItem('userId');
    if (!content) {
        $('.warning').show().prop('hidden', false).html(`<p>Message cannot be empty</p>`);
    } else {
        const newMessage = {
            creatorId,
            content
        }
        $.ajax({
            url: '/api/messages',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newMessage),
            headers: {
                authorization: `Bearer ${window.localStorage.token}`
            }
        })
        .done(() => {
            getUserMessages();
            renderMessages();
            hideForm();
        })
        .fail((xhr, err) => {
            let jsonResponse = JSON.parse(xhr.responseText);
			let errMessage = jsonResponse['message'];
			$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>${errMessage}</p></span>`);
        })
    }
}

function showConfirmDelete(id) {
    $('.form-overlay').show().prop('hidden', false).html(TEMPLATES.confirmDelete(id));
}

function deleteMessage(id) {
    $.ajax({
        url: '/api/messages/' + id,
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(() => {
        STORE.deleteById(id);
        renderMessages();
        hideForm(); 
    })
}

function showConfirmForward(id) {
    $('.form-overlay').show().prop('hidden', false).html(TEMPLATES.confirmForward(id));
}

function forwardMessage(id) {
    $.ajax({
        url: '/api/messages/' + id + '/forward',
        type: 'PUT',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(() => {
        getUserMessages(); 
        renderMessages(); 
        hideForm(); 
    })
}

function upvoteMessage(id) {
    $.ajax({
        url: '/api/messages/' + id + '/upvote',
        type: 'PATCH', 
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(res => {
        STORE.update(res.message);
        renderMessages();
    })
}

function downvoteMessage(id) {
    $.ajax({
        url: '/api/messages/' + id + '/downvote',
        type: 'PATCH',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(res => {
        STORE.update(res.message);
        renderMessages(); 
    })
}