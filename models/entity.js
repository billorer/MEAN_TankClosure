var Entity = function(posX = 250, posY = 250) {
	var self = {
		x:posX,
		y:posY,
		spdX:0,
		spdY:0,
		id:"",
	};

	self.update = function() {
		self.updatePosition();
	};

	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
	};

	self.getDistance = function(pt){
		return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
	};

	return self;
};

module.exports = Entity;
