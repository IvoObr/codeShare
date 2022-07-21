
import express from 'express';
import logger from './utils/logger';
import socketio, { Server } from 'socket.io';

const app = express();

app.use(express.static('public'));

const expressServer = app.listen(9000, function() {
    logger.success('Listening on port 9000.');
});

const socketServer = new Server(expressServer, { /* options */ });

socketServer.on('connect', function(socket) {
    socket.emit('messageFromServer', { data: 'Welcome to the SocketIO server!' });

    socket.on('messageToServer', (dataFromClient) => {
        logger.info(dataFromClient);
    });

    socket.on('newMessageToServer', function(msg) {
        socketServer.emit('messageToClients', { text: msg.text });
    });
});

socketServer.of('/dev').on('connect', function(socket) {
    logger.success('Someone connected to the /dev namespace');
    socket.emit('welcome', { data: 'Welcome to the DEV channel!' });
}); 

/* npx nodemon src/chat.ts */

// const server = new Server();

// TODO:
// https://www.npmjs.com/package/socket.io