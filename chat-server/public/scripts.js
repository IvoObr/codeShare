// eslint-disable-next-line
const mainSocket = io('http://localhost:9000');
// eslint-disable-next-line
const devSocket = io('http://localhost:9000/dev'); //** /dev namespace
    
mainSocket.on('connect', function() {
    console.log('mainSocket.id ----> ', mainSocket.id);
});

devSocket.on('connect', function() {
    console.log('devSocket.id ----> ', devSocket.id);

});
devSocket.on('welcome', function(msg) {
    console.log('/dev msg ', msg);
});

mainSocket.on('messageFromServer', function(dataFromServer) {
    console.log(dataFromServer);
        
    mainSocket.emit('messageToServer', { data: 'This message is from the client!' });

});

document.querySelector('#message-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    
    mainSocket.emit('newMessageToServer', { text: newMessage });
});

mainSocket.on('messageToClients', function(msg) {
    console.log(msg);
    document.querySelector('#messages').innerHTML += `<li> ${msg.text}</li>`;
});

