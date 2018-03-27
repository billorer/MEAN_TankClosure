var io = require('../server');

var lobbies = [];

io.on('connection', (socket) => {
    socket.on('createLobby', (data) => {
        lobbies.push(data.lobby);
        //socket.emit('updateLobbies', {lobbies: lobbies});
    });
});
