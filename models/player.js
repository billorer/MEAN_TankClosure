var playerPrototype = Player.prototype;

function Player(playerLobbyHostId, playerId, playerName, playerStatus) {
    this.playerLobbyHostId = playerLobbyHostId;
    this.playerId = playerId;
    this.playerName = playerName;
    this.playerStatus = playerStatus;
}
module.exports = Player;
