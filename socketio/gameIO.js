var io = require('../server');

var lobbies = require('./lobbyIO').lobbies;
var socketHashMapList = require('./lobbyIO').socketHashMapList;

const Tank = require('../models/tank');
const Bullet = require('../models/bullet');

io.on('connection', (socket) => {
    socket.on('startGame', function(data){

        let gameLobbyId = data.lobbyId;
        let playerImgData = data.playerImgData;
        // The game will start in this lobby, therefore it should not be visible in the menu
        lobbies[gameLobbyId].lobbyInGame = true;
        io.emit('updateLobbiesList', {lobbies: lobbies});

        // Iterate through the players in the lobby and join them to a room
        // Create a tank for each player
        for(let playerKey in lobbies[gameLobbyId].lobbyPlayers){
            socketHashMapList[playerKey].join(gameLobbyId);
            socketHashMapList[playerKey].mobile = false;
            socketHashMapList[playerKey].code = 999;
            Tank.onConnect(socketHashMapList[playerKey], playerImgData, gameLobbyId);
        }

        io.to(gameLobbyId).emit('navigateToCanvas');
        io.to(gameLobbyId).emit('initializeGame', {
    		player:Tank.getAllInitPack(gameLobbyId),
    		bullet:Bullet.getAllInitPack(gameLobbyId),
    	});

        // var clients = io.sockets.adapter.rooms[gameLobbyId].sockets;
        //
        // //to get the number of clients
        // var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
        //
        // for (var clientId in clients ) {
        //     console.log("CLientID:"+clientId);
        //      //this is the socket of each client in the room.
        //      var clientSocket = io.sockets.connected[clientId];
        //
        //      //you can do whatever you need with this
        //      //clientSocket.emit('new event', "Updates");
        //
        // }

        socket.emit("lobbyHost",{lobbyHostId: gameLobbyId});
		console.log("StartGame");
	});

    socket.on('code', function(data){
        for(var i in socketHashMapList){
            var currentSocket = socketHashMapList[i];
            if(currentSocket.code == data.code && currentSocket.mobile == false) {

                var curPlayer = Tank.list[currentSocket.id];
                var stateValue;

                if(data.state == "true"){
                    stateValue = true;
                }else{
                    stateValue = false;
                }

                switch(data.inputId) {
                    case "up":
                        curPlayer.pressingUp = stateValue;
                        break;
                    case "down":
                        curPlayer.pressingDown = stateValue;
                        break;
                    case "left":
                        curPlayer.pressingLeft = stateValue;
                        break;
                    case "right":
                        curPlayer.pressingRight = stateValue;
                        break;
                    case "attack":
                        curPlayer.pressingAttack = stateValue;
                        break;
                    case "mouseAngle":
                        curPlayer.mouseAngle = parseFloat(data.state);
                        break;
                    default:
                        break;
                }
            }
        }
    });

    socket.on('reset', function(resetData){
        let data = resetData.data;
        for(var i in Tank.list){
            var p = Tank.list[i];
            if(p.x == data.x && p.y == data.y && p.gameLobbyId == data.gameLobbyId){
                p.hp = p.hpMax;
                do {
                    p.x = Math.random() * 950;
                    p.y = Math.random() * 700;
                } while(checkIfGoodRespawn(p));
            }
        }
    });

    socket.on('disconnect', () => {
        Tank.onDisconnect(socket);
    });
});

var checkIfGoodRespawn = function(player){
	for(var i in Tank.list){
		if(player.id != Tank.list[i].id)
			if(player.collides(Tank.list[i], player))
				return true;
	}
	return false;
};

//25 frame per second
setInterval(function(){
    for(let lobbyKey in lobbies){
        if(lobbies[lobbyKey].lobbyInGame){
            let pack = {
        		player:Tank.update(lobbyKey),
        		bullet:Bullet.update(lobbyKey),
        	};
            let initPack = {player:Tank.getInitPackPlayerList(lobbyKey), bullet: Bullet.getInitPackBulletList(lobbyKey)};
            let removePack = {player:Tank.getRemovePackPlayerList(lobbyKey), bullet: Bullet.getRemovePackBulletList(lobbyKey)};

            io.to(lobbyKey).emit('initializeGame', initPack);
        	io.to(lobbyKey).emit('update', pack);
        	io.to(lobbyKey).emit('remove', removePack);

            Tank.setEmptyInitPack(lobbyKey);
            Tank.setEmptyRemovePack(lobbyKey);
            Bullet.setEmptyInitPack(lobbyKey);
            Bullet.setEmptyRemovePack(lobbyKey);
        }
    }
}, 1000/25);
