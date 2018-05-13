export class Bullet {

    id: string;
    x: number;
    y:number;

    ctx:CanvasRenderingContext2D;
    images: any;

    constructor(initPack, ctx, images){
        this.id = initPack.id;
        this.x = initPack.x;
        this.y = initPack.y;

        this.ctx = ctx;
        this.images = images;
    }

    draw(){
        var width = this.images.bullet.width / 2;
        var height = this.images.bullet.width / 2;

        this.ctx.drawImage(this.images.bullet, 0, 0, this.images.bullet.width, this.images.bullet.height,
            this.x, this.y, width, height);
    };
}
