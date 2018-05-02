function showMessageForm() {
	$('.form-overlay').show().prop('hidden', false).html(TEMPLATES.messageForm);
}

function hideForm() {
    $('.form-overlay').fadeToggle('fast').hide().prop('hidden', true);
}

function getUserMessages(displayUserMessages) {
    $.ajax({
        url: '/api/messages',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(userMessages => {
        displayUserMessages(userMessages);
    })
}

function displayUserMessages(userMessages) {
    let messages = {
        userMessages: userMessages
    };
    let userMessageCards = messages.userMessages.map(message => {
        return TEMPLATES.messageTemplate(message);
    });
    $('.messageswrapper').html(userMessageCards).show().prop('hidden', false);
    $('main').hide();
}

function getAndDisplayUserMessages() {
    getUserMessages(displayUserMessages);
}

function displayNewMessage(returnMessage) {
    let messageCard = $(TEMPLATES.messageCard); 
    $('.form-overlay').html(messageCard);
    messageCard.find('.message-card').html(`<p>${returnMessage}</p>`);
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
        .done(res => {
            let returnMessage = res.content; 
            displayNewMessage(returnMessage);
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
    let messageToDelete = $('#' + id); 
    $.ajax({
        url: '/api/messages/' + id,
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(() => {
        messageToDelete.remove();
        hideForm(); 
    })
}

function showConfirmForward(id) {
    $('.form-overlay').show().prop('hidden', false).html(TEMPLATES.confirmForward(id));
}

function forwardMessage(id) {
    let messageToForward = $('#' + id);
    $.ajax({
        url: '/api/messages/forward/' + id,
        type: 'PUT',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(() => {
        hideForm(); 
    })
}