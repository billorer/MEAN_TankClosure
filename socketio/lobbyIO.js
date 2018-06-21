var io = require('../server');
const Lobby = require('../models/lobby');
const Player = require('../models/player');
const Tank = require('../models/tank');

var lobbies = {};
var socketHashMapList = {};

module.exports = { lobbies, socketHashMapList };

io.on('connection', (socket) => {
    console.log("A new socket connected: " + socket.id);
    socketHashMapList[socket.id] = socket;

    socket.mobile = true;

    console.log("The socket ids:");
	for(let socket in socketHashMapList){
		console.log(socket);
	}

    socket.on('createLobby', (data) => {
        let curLobby = data.lobby;
        // Adding a new lobby to the hashmap
        lobbies[curLobby.lobbyHostId] = new Lobby(curLobby.lobbyHostId, curLobby.lobbyName,
            curLobby.lobbyPassword, curLobby.lobbyMap, curLobby.lobbyMaxPlayer,
            curLobby.lobbyCurPlayer);
        console.log("A lobby has been created: " + curLobby.lobbyHostId);
        console.log("Player: " + socket.id + " joined to lobby: " + curLobby.lobbyHostId);
        addPlayerToLobby(curLobby.lobbyHostId, data.newPlayer);
        console.log("Sending players and lobbies list to the clients!");
        sendPlayersListToClients(curLobby.lobbyHostId);
        socket.emit('joinSuccess', {});
        // Send the players list to the sockets in the same lobby
        io.emit('updateLobbiesList', {lobbies: lobbies});
    });

    socket.on('getLobbies', (data) => {
        console.log("LobbyList:");
        for (let lobby in lobbies){
            if(lobbies.hasOwnProperty(lobby)){
                console.log(lobby);
            }
        }
        socket.emit('updateLobbiesList', {lobbies: lobbies});
    });

    socket.on('joinLobby', (data) => {
        let hostId = data.newPlayer.playerLobbyHostId;
        //socket.join(hostId);
        // Check if the lobby exists and if it has free space
        if(lobbies.hasOwnProperty(hostId) && lobbies[hostId].lobbyCurPlayer < lobbies[hostId].lobbyMaxPlayer){
            console.log("Player: " + socket.id + " joined to lobby: " + hostId);
            addPlayerToLobby(hostId, data.newPlayer);
            console.log("Sending players and lobbies list to the clients!");
            sendPlayersListToClients(hostId);
            socket.emit('joinSuccess', {});
            // Send the players list to the sockets in the same lobby
            io.emit('updateLobbiesList', {lobbies: lobbies});
        } else {
            socket.emit('joinUnSuccess',{});
        }
    });

    socket.on('setImageData', (data) => {
        let playerId = data.playerId;
        let code = data.code;
        let playerImgData = data.playerImgData;
        console.log("SetIMGDATA!");
        console.log(playerId);
        //console.log(socketHashMapList[playerId]);

        socketHashMapList[playerId].playerImgData = playerImgData;
        console.log(socketHashMapList[playerId].playerImgData);
        socketHashMapList[playerId].code = code;
    });

    socket.on('playerReady', (data) => {
        let hostId = data.hostId;
        // Check if the lobby exists
        if(lobbies.hasOwnProperty(hostId)) {
            console.log("Player status changed: " + data.playerId);
            lobbies[hostId].lobbyPlayers[data.playerId].playerStatus = data.playerState;
            sendPlayersListToClients(hostId);
        }
    });

    socket.on('leaveLobby', (data) => {
        let hostId = data.hostId;
        let playerId = data.playerId;

        console.log("Player: " + playerId + " left lobby: " + hostId);

        if(playerId === hostId && lobbies[hostId] != null){

            console.log("Deleting lobby: " + hostId);
            deleteLobby(hostId);
            //io.to(gameLobbyId).emit('kickLobbyPlayer', {msg: "The lobby has been deleted!"});
        }else if(lobbies[hostId] != null){
            console.log("Deleting lobbyPlayer: " + playerId);
            deleteLobbyPlayer(hostId, playerId);
            Tank.onDisconnect(socketHashMapList[playerId]);
            //socket.emit('kickLobbyPlayer', {msg: "You have left the lobby!"});
            sendPlayersListToClients(hostId);
        }

        io.emit('updateLobbiesList', {lobbies: lobbies});
    });

    socket.on('playerKick', (data) => {
        let hostId = data.hostId;
        let playerId = data.playerId;

        socketHashMapList[playerId].emit('kickLobbyPlayer', {msg: "You have been kicked from the lobby!"});
        deleteLobbyPlayer(hostId, playerId);
        sendPlayersListToClients(hostId);
        //update the lobby list on the client side
        io.emit('updateLobbiesList', {lobbies: lobbies});
    });

    // socket.on('changeLobbyStatus', (data) => {
    //     if(lobbies.hasOwnProperty(data.lobbyHostId)){
    //         lobbies[data.lobbyHostId].lobbyInGame = true;
    //     }
    //     io.emit('updateLobbiesList', {lobbies: lobbies});
    // });

    socket.on('disconnect', () => {
        //delete the lobbies of the socket if there is any
        if(lobbies.hasOwnProperty(socket.id)) {
            deleteLobby(socket.id);
        }
        else {
            //iterate through the lobbies, and delete a player from a lobby
            for(let lobby in lobbies){
                deleteLobbyPlayer(lobby, socket.id);
                sendPlayersListToClients(lobby);
            }
        }
        //remove the socket from the socketList
        delete socketHashMapList[socket.id];

        //update the lobby list on the client side
        io.emit('updateLobbiesList', {lobbies: lobbies});
        console.log("Disconnected: "+socket.id);
    });
});

var sendPlayersListToClients = function(pHostId) {
    for(let lobbyPlayer in lobbies[pHostId].lobbyPlayers){
        socketHashMapList[lobbyPlayer].emit('updatePlayersList', {playersList: lobbies[pHostId].lobbyPlayers});
    }
};

var deleteLobby = function(pHostId) {
    //iterate through the lobby players and kick them, before deleting the lobby
    for(let lobbyPlayer in lobbies[pHostId].lobbyPlayers){
        socketHashMapList[lobbyPlayer].emit('kickLobbyPlayer', {msg: "The lobby has been deleted!"});
    }
    delete lobbies[pHostId];
};

var deleteLobbyPlayer = function(pHostId, pPlayerId) {
    if(lobbies[pHostId].lobbyPlayers.hasOwnProperty(pPlayerId)){
        delete lobbies[pHostId].lobbyPlayers[pPlayerId];
        lobbies[pHostId].lobbyCurPlayer -= 1;
        lobbies[pHostId].curMaxPlayer();
    }
};

var addPlayerToLobby = function(pHostId, pPlayer) {
    lobbies[pHostId].addPlayer(new Player(pHostId, pPlayer.playerId, pPlayer.playerName, pPlayer.playerStatus));
    lobbies[pHostId].lobbyCurPlayer += 1;
    lobbies[pHostId].curMaxPlayer();
};
