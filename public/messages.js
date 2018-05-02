function showMessageForm() {
	$('.form-overlay').show().prop('hidden', false).html(TEMPLATES.messageForm);
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
        let messageTemplate = $(TEMPLATES.messageTemplate);
        messageTemplate.find('.content').html(message.content);
        messageTemplate.find('#upvotecounter').html(message.upvotes);
        messageTemplate.find('#downvotecounter').html(message.downvotes);
        return messageTemplate;
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

function showConfirmDelete() {
    $('.form-overlay').show().prop('hidden', false).html(TEMPLATES.confirmDelete);
}

function deleteMessage(event) {
    showConfirmDelete(); 
    let messageToDelete = $(event.currentTarget).closest('.message-card');
    $('body').on('click', '#confirmdelete', event => {
        messageToDelete.remove(); 
        $('.form-overlay').hide().prop('hidden', true); 
    })
}