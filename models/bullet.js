const Entity = require('./entity');

var socketHashMapList = require('../socketio/lobbyIO').socketHashMapList;

var initPackBulletList = [[]];
var removePackBulletList = [[]];

var Bullet = function(parent, angle, damage, gameLobbyId){
	var self = Entity();
	self.id = Math.random();
	self.spdX = Math.cos(angle/180*Math.PI) * 10;
	self.spdY = Math.sin(angle/180*Math.PI) * 10;
	self.parent = parent;
	self.timer = 0;
	self.toRemove = false;
	self.gameLobbyId = gameLobbyId;

	//default
	self.imgWidth = 7;
	self.imgHeight = 7;

	var super_update = self.update;

	self.update = function(){
        const Tank = require('./tank');

		if(self.timer++ > 100)
			self.toRemove = true;
		super_update();

		for(var i in Tank.list){
			var p = Tank.list[i];

			if(p.collides(p, self) && self.parent !== p.id && self.gameLobbyId == p.gameLobbyId){
				p.hp -= damage;
				if(p.hp <= 0){
					var shooter = Tank.list[self.parent];
					if(shooter){
						shooter.score += 1;
					}
					for(i in socketHashMapList){
						socketHashMapList[i].emit('explosion', p);
					}
				}
				self.toRemove = true;
			}
		}
	};
	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
		};
	};

	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
		};
	};

	Bullet.list[self.id] = self;
	//initPackBulletList[self.gameLobbyId] = ( typeof initPackBulletList[self.gameLobbyId] != 'undefined' && initPackBulletList[self.gameLobbyId] instanceof Array ) ? initPackBulletList[self.gameLobbyId] : [];
	initPackBulletList[self.gameLobbyId].push(self.getInitPack());
	//removePackBulletList[self.gameLobbyId] = ( typeof removePackBulletList[self.gameLobbyId] != 'undefined' && removePackBulletList[self.gameLobbyId] instanceof Array ) ? removePackBulletList[self.gameLobbyId] : [];
	return self;
};

Bullet.list = {};
Bullet.update = function(lobbyKey) {
	var pack = [];
	for(var i in Bullet.list){
		if(Bullet.list[i].gameLobbyId == lobbyKey){
			var bullet = Bullet.list[i];
			bullet.update();

			if(bullet.toRemove){
				removePackBulletList[Bullet.list[i].gameLobbyId].push(bullet.id);
				delete Bullet.list[i];
			}
			else{
				pack.push(bullet.getUpdatePack());
			}
		}
	}
	return pack;
};

Bullet.getAllInitPack = function(lobbyKey){
	var bullets = [];
	for(var i in Bullet.list){
		if(Bullet.list[i].gameLobbyId == lobbyKey){
			bullets.push(Bullet.list[i].getInitPack());
		}
	}
	return bullets;
};

Bullet.getInitPackBulletList = function(lobbyKey) {
	initPackBulletList[lobbyKey] = ( typeof initPackBulletList[lobbyKey] != 'undefined' && initPackBulletList[lobbyKey] instanceof Array ) ? initPackBulletList[lobbyKey] : [];
	return initPackBulletList[lobbyKey];
};

Bullet.getRemovePackBulletList = function(lobbyKey) {
	removePackBulletList[lobbyKey] = ( typeof removePackBulletList[lobbyKey] != 'undefined' && removePackBulletList[lobbyKey] instanceof Array ) ? removePackBulletList[lobbyKey] : [];
	return removePackBulletList[lobbyKey];
};

Bullet.setEmptyInitPack = function(lobbyKey) {
	initPackBulletList[lobbyKey] = [];
};

Bullet.setEmptyRemovePack = function(lobbyKey){
	removePackBulletList[lobbyKey] = [];
};

module.exports = Bullet;
