function showMessageForm() {
    TEMPLATES.showElement('.popup__overlay');
    $('.popup__overlay').html(TEMPLATES.messageForm);
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
        TEMPLATES.showElement('.messages__wrapper');
        $('.messages__wrapper').html(TEMPLATES.noMessagesTemplate);
    } else {
        let userMessageCards = STORE.messages.map(message => {
            return TEMPLATES.messageTemplate(message);
        });
        TEMPLATES.showElement('.messages__wrapper');
        $('.messages__wrapper').html(userMessageCards);
        $('.messages__wrapper').find('.vote__counter').each((index, element) => {
            if ($(element).text() > 0) {
                $(element).addClass('counter--positive');
            } else if ($(element).text() < 0) {
                $(element).addClass('counter--negative');
            }
        })
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
        };
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
    let userMessage = STORE.messages.find(message => {
        return message._id == id; 
    });
    let userId = window.localStorage.userId; 
    if (!(userMessage.upvoted.includes(userId))) {
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
}

function downvoteMessage(id) {
    let userMessage = STORE.messages.find(message => {
        return message._id == id; 
    });
    let userId = window.localStorage.userId; 
    if (!(userMessage.downvoted.includes(userId))) {
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
}