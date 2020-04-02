import express from 'express';
import http from 'http';
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('public'));
app.use(express.static('node_modules/font-awesome'));

const game = createGame();

game.subscribe((command) => {
    console.log(`> Emmiting ${command.type}`);
    sockets.emit(command.type, command);
});

sockets.on('connection', (socket) => {
    const playerId = socket.id;

    socket.emit('setup', game.state);

    socket.on('disconnect', () => {
        game.removePlayer({playerId});
        console.log(`Player disconnected ${playerId}`);
    });

    socket.on('card-click', (command) => {
        console.log(`> Player estimate ${playerId}`);

        game.estimate({
            playerId,
            cardId: command.cardId
        });
    });

    socket.on('add-player', (command) => {
        console.log(`> Player connected on Server with id: ${playerId}`);

        game.addPlayer({
            playerId,
            playerName: command.playerName
        });
    });

    socket.on('restart-game', () => {
        console.log(`> restart-game`);

        game.restart();
    });

});

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`);
});