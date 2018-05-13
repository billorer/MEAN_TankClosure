export class Tank {

    id: string;
    number: number;
    x: number;
    y:number;
    hp:number;
    hpMax:number;
    score:number;
    tankAngle:number;
    mouseAngle:number;
    curBullet:number;
    imgNR:number;
    reloading: boolean;

    xPlayerPivot: number;
    yPlayerPivot: number;
    canShoot: boolean;
    recoilSpeed: number;

    ctx:CanvasRenderingContext2D;
    images: any;

    constructor(initPack, ctx, images){
        this.id = initPack.id;
        this.number = initPack.number;
        this.x = initPack.x;
        this.y = initPack.y;
        this.hp = initPack.hp;
        this.hpMax = initPack.hpMax;
        this.score = initPack.score;
        this.tankAngle = initPack.tankAngle;
        this.mouseAngle = initPack.mouseAngle;
        this.curBullet = initPack.curBullet;
        this.imgNR = initPack.imgNR;
        //default
        this.reloading = false;

        this.ctx = ctx;
        this.images = images;

    }

    drawHP() {
        let hpWidth = 50 * this.hp / this.hpMax;
        // ctx.shadowBlur = 20;
        // ctx.shadowColor = "#ff4949";
        // ctx.lineWidth = 2.5;
        // ctx.strokeStyle = "#003300";
        //console.log("this: " + this.hp + " " + this.hpMax);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.xPlayerPivot - hpWidth / 2, this.yPlayerPivot - 40, hpWidth, 4);
        //ctx.shadowColor = "rgba(0, 0, 0, 0)";
        //console.log("HPWIDTH: " + hpWidth + " " + this.hp + " " + this.hpMax);
    };

    drawTankBody(TO_RADIANS, tankBodyImage) {

        this.xPlayerPivot = this.x + tankBodyImage.width / 2;
        this.yPlayerPivot = this.y + tankBodyImage.height / 2;

        var width = tankBodyImage.width;
        var height = tankBodyImage.height;

        /// we make sure that the current state is saved
        this.ctx.save();

        /// make sure pivot is moved to center
        this.ctx.translate(this.xPlayerPivot, this.yPlayerPivot);

        /// rotate, you should make new sprite where direction
        /// points to the right. I'm add 90 here to compensate
        this.ctx.rotate((this.tankAngle + 90) * TO_RADIANS);

        /// translate back before drawing the sprite
        this.ctx.translate(-this.xPlayerPivot, -this.yPlayerPivot);
        this.ctx.drawImage(tankBodyImage, 0, 0, width, height, this.x, this.y, width, height);

        this.ctx.restore();
    };

    drawTankTower(TO_RADIANS, tankBodyImage, tankTowerImage) {
        //TANKTOWER
        this.ctx.save();

        /// make sure pivot is moved to center
        this.ctx.translate(this.xPlayerPivot, this.yPlayerPivot);

        /// rotate, you should make new sprite where direction
        this.ctx.rotate((this.mouseAngle - 90) * TO_RADIANS);
        /// translate back before drawing the sprite
        this.ctx.translate(-this.xPlayerPivot, -this.yPlayerPivot);

        var newXTower = this.x + tankBodyImage.width / 2 - tankTowerImage.width / 2;
        var newYTower = this.y + tankBodyImage.height / 2 - tankTowerImage.width / 2;

        if(this.canShoot == false && this.recoilSpeed < 17 && !this.reloading){
            this.recoilSpeed += 1.5;
            newYTower -= this.recoilSpeed;
        }else{
            this.recoilSpeed = 0;
        }

        this.ctx.drawImage(tankTowerImage, 0, 0, tankTowerImage.width, tankTowerImage.height, newXTower, newYTower, tankTowerImage.width, tankTowerImage.height);
        this.ctx.restore();
    };

    draw() {
      if(this.imgNR != 0){
        var TO_RADIANS = Math.PI/180;
        var tankBodyImage = this.images.tankBodies[this.imgNR - 1];
        var tankTowerImage = this.images.tankTowers[this.imgNR - 1];

        this.drawTankBody(TO_RADIANS, tankBodyImage);
        this.drawTankTower(TO_RADIANS, tankBodyImage, tankTowerImage);

        this.drawHP();
      }
  };
}
