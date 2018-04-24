function showMessageForm() {
	$('.form-overlay').show().prop('hidden', false).html(TEMPLATES.messageForm);
}

function getUserMessages(handleUserMessages) {
    $.ajax({
        url: '/api/messages',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(userData => {
        handleUserMessages(userData);
    })
}

function handleUserMessages(userData) {
    const userMessages = userData.user.receivedMessages;
    console.log(userMessages);
    displayUserMessages(userMessages);
}

function displayUserMessages(userMessages) {
    let messageTemplate = $(TEMPLATES.messageTemplate);
    $('.messageswrapper').html(messageTemplate).show().prop('hidden', false);
    $('main').hide(); 
}

function getAndDisplayUserMessages() {
    getUserMessages(handleUserMessages);
}

function getNewMessage(handleNewMessage) {
    $.ajax({
        url: '/api/messages',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            authorization: `Bearer ${window.localStorage.token}`
        }
    })
    .done(messages => {
        handleNewMessage(messages);
    })
}

function handleNewMessage(messages) {
    const userId = localStorage.getItem('userId');
    let availableMessages = [];
    for (i = 0; i < messages.length; i++) {
        if (userId !== messages[i].creatorId) {
            availableMessages.push(messages[i]);
        }
    } 
    let index = Math.floor(Math.random() * availableMessages.length);
    let userMessages = [];
    userMessages.push(availableMessages[index]._id);
    localStorage.setItem('receivedMessages', JSON.stringify(userMessages));
    let returnMessage = availableMessages[index].content;
    displayNewMessage(returnMessage);
}

function displayNewMessage(returnMessage) {
    let messageCard = $(TEMPLATES.messageCard); 
    $('.form-overlay').html(messageCard);
    messageCard.find('.message-card').html(`<p>${returnMessage}</p>`);
}

function getAndDisplayNewMessage() {
    getNewMessage(handleNewMessage);
    getAndDisplayReceivedMessages(handleReceivedMessages);
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
            getAndDisplayNewMessage();
        })
        .fail((xhr, err) => {
            let jsonResponse = JSON.parse(xhr.responseText);
			let errMessage = jsonResponse['message'];
			$('.warning').show().prop('hidden', false).html(`<span class="warning"><p>${errMessage}</p></span>`);
        })
    }
}