const STORE = {
    messages: [],
    deleteById: function(id) {
        this.messages = this.messages.filter(message => {
            return message._id !== id; 
        });
    },
    update: function(message) {
        const id = message._id; 
        const index = this.messages.findIndex(_message => {
            return _message._id = id; 
        });
        this.messages[index] = message; 
    }
}