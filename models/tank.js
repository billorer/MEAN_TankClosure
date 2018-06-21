const Entity = require('./entity');
const Bullet = require('./bullet');

var initPackPlayerList = [[]];
var removePackPlayerList = [[]];

const TO_RADIANS = Math.PI/180;

var Tank = function(id, gameLobbyId, x, y){
	var self = Entity(x, y);
	self.id = id;
	self.number = "" + Math.floor(10 * Math.random());

	self.gameLobbyId = gameLobbyId;

	self.pressingRight = false;
	self.pressingLeft = false;
	self.pressingUp = false;
	self.pressingDown = false;
	self.pressingAttack = false;

	self.mouseAngle = 0;
	self.maxSpd = 0;
	self.hp = 0;
	self.hpMax = 0;
	self.score = 0;
	self.tankAngle = 0;
	self.turnSpeed = 0;

	self.damage = 0;

	//cuz we dont know the width and height of the image, later its gonna be updated
	self.xPivot = 0;
	self.yPivot = 0;

	self.imgWidth = 0;
	self.imgHeight = 0;
	self.imgNR = 0;

	self.maxBullet = 0;
	self.curBullet = 0;
	self.reloadTime = 0;
	self.reloading = false;
	//self.towerAngle = 0;

	self.canShoot = true;
	self.recoilTime = 0;

	//this overwrites the update of the Entity, it calls the entity's update and the player's update
	var super_update = self.update;
	self.update = function(){
		self.updateSpd();
		super_update();

		self.checkCollisions();

		if(self.pressingAttack && self.canShoot && !self.reloading){
			if(self.curBullet > 0){
				self.shootBullet(self.mouseAngle);
				self.curBullet--;
			}
			if(self.curBullet == 0){
				self.reloading = true;
				setTimeout(self.reload, self.reloadTime);
			}
			self.canShoot = false;
			setTimeout(self.setCanShoot, self.recoilTime);
		}
	};

	self.setCanShoot = function(){
		self.canShoot = true;
	};

	self.reload = function(){
		self.curBullet = self.maxBullet;
		self.reloading = false;
	};

	self.collides = function(a, b){
		if (a.x < b.x + b.imgWidth &&
			a.x + a.imgWidth > b.x &&
			a.y < b.y + b.imgHeight &&
			a.y + a.imgHeight > b.y) {
			return true;
		}
		return false;
	};

	self.checkIfOutOfMap = function(){
		if(self.x <= 0) {
			self.x = 10;
		}else if(self.x >= 950){
			self.x = 940;
		}else if(self.y <=0){
			self.y = 10;
		}else if(self.y >= 700){
			self.y = 690;
		}
	};

	self.checkCollisions = function(){
		for(var i in Tank.list){
			var player = Tank.list[i];
			if(player.gameLobbyId == self.gameLobbyId){
				self.checkIfOutOfMap();
				//its not the same player
				if(player.x != self.x && player.y != self.y) {
					//check the collision
					if(self.collides(self, player)){
						self.x -= self.spdX;
						self.y -= self.spdY;
					}
				}
			}
		}
	};

	self.shootBullet = function(angle){
		var b = Bullet(self.id, angle, self.damage, self.gameLobbyId);
		b.x = self.xPivot;
		b.y = self.yPivot;
	};

	self.updateSpd = function() {
		if(self.pressingRight){
			self.tankAngle += self.turnSpeed;
		}else if (self.pressingLeft){
			self.tankAngle -= self.turnSpeed;
		}

		if(self.pressingUp){
			self.spdX = self.maxSpd * Math.cos(self.tankAngle * TO_RADIANS);
			self.spdY = self.maxSpd * Math.sin(self.tankAngle * TO_RADIANS);
		}
		else if(self.pressingDown){
			self.spdX = (-1) * self.maxSpd * Math.cos(self.tankAngle * TO_RADIANS);
			self.spdY = (-1) * self.maxSpd * Math.sin(self.tankAngle * TO_RADIANS);
		}
		else{
			self.spdY = 0;
			self.spdX = 0;
		}
	};

	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			number:self.number,
			hp:self.hp,
			hpMax:self.hpMax,
			score:self.score,
			tankAngle:self.tankAngle,
			mouseAngle:self.mouseAngle,
			curBullet:self.curBullet,
			imgNR:self.imgNR,
			gameLobbyId: self.gameLobbyId
		};
	};

	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			hp:self.hp,
			hpMax:self.hpMax,
			score:self.score,
			tankAngle:self.tankAngle,
			mouseAngle:self.mouseAngle,
			curBullet:self.curBullet,
			reloading:self.reloading,
			imgNR:self.imgNR,
			canShoot:self.canShoot,
			gameLobbyId: self.gameLobbyId
		};
	};

	Tank.list[id] = self;
	initPackPlayerList[self.gameLobbyId] = ( typeof initPackPlayerList[self.gameLobbyId] != 'undefined' && initPackPlayerList[self.gameLobbyId] instanceof Array ) ? initPackPlayerList[self.gameLobbyId] : [];
	initPackPlayerList[self.gameLobbyId].push(self.getInitPack());
	removePackPlayerList[self.gameLobbyId] = ( typeof removePackPlayerList[self.gameLobbyId] != 'undefined' && removePackPlayerList[self.gameLobbyId] instanceof Array ) ? removePackPlayerList[self.gameLobbyId] : [];
	return self;
};

Tank.list = {};
Tank.onConnect = function(socket, playerImgData, gameLobbyId, tankX, tankY){
	var player = Tank(socket.id, gameLobbyId, tankX, tankY);

	console.log("New Player's controllerCode: " + socket.code);

	socket.on('keyPress', function(data){
		if(data.inputId === 'left'){
			player.pressingLeft = data.state;
		}
		else if(data.inputId === 'right'){
			player.pressingRight = data.state;
		}
		else if(data.inputId === 'up'){
			player.pressingUp = data.state;
		}
		else if(data.inputId === 'down'){
			player.pressingDown = data.state;
		}
		else if(data.inputId === 'attack'){
			player.pressingAttack = data.state;
		}
		else if(data.inputId === 'mouseAngle'){
			player.mouseAngle = data.state;
			player.xPivot = data.x;
			player.yPivot = data.y;
		}
	});
	Tank.playerImgData(player, playerImgData);
};

Tank.playerImgData = function(player, data) {
	console.log(data);
	player.imgWidth = data.width;
	player.imgHeight = data.height;
	player.imgNR = data.imgNR;

	switch(player.imgNR){
		case 0:player.maxBullet = 5; player.curBullet = 5; player.reloadTime = 5000; player.recoilTime = 500;
			player.hp = 100;
			player.hpMax = 100;
			player.maxSpd = 6.5;
			player.damage = 30; //10
			player.turnSpeed = 10;
			break;
		case 1:player.maxBullet = 8; player.curBullet = 8; player.reloadTime = 2500; player.recoilTime = 500;
			player.hp = 50;
			player.hpMax = 50;
			player.maxSpd = 7.5;
			player.damage = 7.5;
			player.turnSpeed = 15;
			break;
		case 2:player.maxBullet = 3; player.curBullet = 3; player.reloadTime = 10000; player.recoilTime = 500;
			player.hp = 150;
			player.hpMax = 150;
			player.maxSpd = 5;
			player.damage = 25;
			player.turnSpeed = 5;
			break;
	}
};

Tank.getAllInitPack = function(lobbyKey){
	var players = [];
	for(var i in Tank.list){
		if(Tank.list[i].gameLobbyId == lobbyKey){
			players.push(Tank.list[i].getInitPack());
		}
	}
	return players;
};

Tank.onDisconnect = function(socket){
	if(Tank.list[socket.id]){
		removePackPlayerList[Tank.list[socket.id].gameLobbyId].push(socket.id);
		delete Tank.list[socket.id];
	}
};

Tank.update = function(lobbyKey) {
	var pack = [];
	for(let i in Tank.list){
		if(Tank.list[i].gameLobbyId == lobbyKey){
			var player = Tank.list[i];
			player.update();
			pack.push(player.getUpdatePack());
		}
	}
	return pack;
};

Tank.getInitPackPlayerList = function(lobbyKey) {
	return initPackPlayerList[lobbyKey];
};

Tank.getRemovePackPlayerList = function(lobbyKey) {
	return removePackPlayerList[lobbyKey];
};

Tank.setEmptyInitPack = function(lobbyKey) {
	initPackPlayerList[lobbyKey] = [];
};

Tank.setEmptyRemovePack = function(lobbyKey){
	removePackPlayerList[lobbyKey] = [];
};

module.exports = Tank;
