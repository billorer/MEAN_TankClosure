var lobbyPrototype = Lobby.prototype;

function Lobby(lobbyHostId, lobbyName, lobbyPassword, lobbyMap,
    lobbyMaxPlayer,lobbyCurPlayer) {
        this.lobbyHostId = lobbyHostId;
        this.lobbyName = lobbyName;
        this.lobbyPassword = lobbyPassword;
        this.lobbyMap = lobbyMap;
        this.lobbyMaxPlayer = lobbyMaxPlayer;
        this.lobbyCurPlayer = 0;
        this.curMaxPlayer();
        this.lobbyPlayers = {};
        this.lobbyInGame = false;
        this.lobbyGameTime = null;
}

Lobby.prototype.curMaxPlayer = function() {
    this.lobbyCurMaxPlayers = this.lobbyCurPlayer+"/"+this.lobbyMaxPlayer;
};

// Add new player
Lobby.prototype.addPlayer = function(player) {
    this.lobbyPlayers[player.playerId] = player;
};

module.exports = Lobby;
