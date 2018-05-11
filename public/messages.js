function showMessageForm() {
    TEMPLATES.showElement('.popup__overlay');
    $('.popup__overlay').html(TEMPLATES.messageForm);
}

function hideForm() {
    TEMPLATES.hideElement('.popup__overlay');
    $('body').css('overflow', 'auto');
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
        TEMPLATES.showElement('.messages-wrapper');
        $('.messages-wrapper').html(TEMPLATES.noMessagesTemplate);
    } else {
    let userMessageCards = STORE.messages.map(message => {
        if (message.voteScore > 0) {
            $('#vote__counter').css('color', '#4DC14B');
            console.log('votescore is greater than 0');
        } else if (message.voteScore < 0) {
            $('#vote__counter').css('color', '#F95738');
            console.log('votescore is less than 0');
        } else {
            $('#vote__counter').css('color', '#0D3B66');
            console.log(`voteScore is ${message.voteScore}`);
        }
        return TEMPLATES.messageTemplate(message);
    });
    TEMPLATES.showElement('.messages-wrapper');
    $('.messages-wrapper').html(userMessageCards);
    }
}

function handleSendMessage(event) {
    event.preventDefault();
    const content = $('[name=input]').val();
    const creatorId = localStorage.getItem('userId');
    if (!content) {
        TEMPLATES.showElement('.popup__text--warning');
        $('.popup__text--warning').html(`<p>Message cannot be empty</p>`);
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
            TEMPLATES.showElement('.popup__text--warning');
            $('.popup__text--warning').html(`<p>${errMessage}</p>`);
        })
    }
}

function showConfirmDelete(id) {
    TEMPLATES.showElement('.popup__overlay');
    $('.popup__overlay').html(TEMPLATES.confirmDelete(id));
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
    TEMPLATES.showElement('.popup__overlay');
    $('.popup__overlay').html(TEMPLATES.confirmForward(id));
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