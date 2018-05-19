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

    TO_RADIANS: number;

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

        this.TO_RADIANS = Math.PI/180;
    }

    drawHP() {
        let hpWidth = 50 * this.hp / this.hpMax;
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.xPlayerPivot - hpWidth / 2, this.yPlayerPivot - 40, hpWidth, 4);
    };

    drawTankBody(TO_RADIANS, tankBodyImage) {
        this.xPlayerPivot = this.x + tankBodyImage.width / 2;
        this.yPlayerPivot = this.y + tankBodyImage.height / 2;

        /// we make sure that the current state is saved
        this.ctx.save();

        /// make sure pivot is moved to center
        this.ctx.translate(this.xPlayerPivot, this.yPlayerPivot);

        /// rotate, you should make new sprite where direction
        /// points to the right. I'm add 90 here to compensate
        this.ctx.rotate((this.tankAngle + 90) * TO_RADIANS);

        /// translate back before drawing the sprite
        this.ctx.translate(-this.xPlayerPivot, -this.yPlayerPivot);
        this.ctx.drawImage(tankBodyImage, 0, 0, tankBodyImage.width, tankBodyImage.height, this.x, this.y, tankBodyImage.width, tankBodyImage.height);

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

        let newXTower = this.x + tankBodyImage.width / 2 - tankTowerImage.width / 2;
        let newYTower = this.y + tankBodyImage.height / 2 - tankTowerImage.width / 2;

        if(!this.canShoot && this.recoilSpeed < 17 && !this.reloading) {
            this.recoilSpeed += 1.5;
            newYTower -= this.recoilSpeed;
        } else {
            this.recoilSpeed = 0;
        }

        this.ctx.drawImage(tankTowerImage, 0, 0, tankTowerImage.width, tankTowerImage.height, newXTower, newYTower, tankTowerImage.width, tankTowerImage.height);
        this.ctx.restore();
    };

    draw() {
        let tankBodyImage = this.images.tankBodies[this.imgNR];
        let tankTowerImage = this.images.tankTowers[this.imgNR];

        this.drawTankBody(this.TO_RADIANS, tankBodyImage);
        this.drawTankTower(this.TO_RADIANS, tankBodyImage, tankTowerImage);
        this.drawHP();
  };
}
