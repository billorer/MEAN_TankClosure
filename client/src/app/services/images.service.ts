import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ImagesService {

    images: any;
    imgPath: string;

    constructor() {
        this.imgPath = environment.imageFolderPath;
        this.initializeImages();
    }

    getImages(){
        return this.images;
    }

    initializeImages(){
        this.images = {};
        this.images.bullet = new Image();
        this.images.bullet.src = this.imgPath + 'bullet2.png';

        this.images.map = new Image();
        this.images.map.src = this.imgPath + 'map.png';

        this.images.tankBodies = {};
        this.images.tankTowers = {};

        this.images.tankBodies[0] = new Image();
        this.images.tankBodies[0].src = this.imgPath + 'tanks/tank1_body.png';
        this.images.tankTowers[0] = new Image();
        this.images.tankTowers[0].src = this.imgPath + 'tanks/tank1_tower.png';

        this.images.tankBodies[1] = new Image();
        this.images.tankBodies[1].src = this.imgPath + 'tanks/tank2_body.png';
        this.images.tankTowers[1] = new Image();
        this.images.tankTowers[1].src = this.imgPath + 'tanks/tank2_tower.png';

        this.images.tankBodies[2] = new Image();
        this.images.tankBodies[2].src = this.imgPath + 'tanks/tank3_body.png';
        this.images.tankTowers[2] = new Image();
        this.images.tankTowers[2].src = this.imgPath + 'tanks/tank3_tower.png';
    }

}
