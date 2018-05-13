import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SocketioService } from '../../services/socketio.service';

import { Observable } from "rxjs";

import { Tank } from '../../models/tank';
import { Bullet } from '../../models/bullet';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
    selection: boolean;
    selfId: string;

    tanksList: Tank[];
    bulletsList: Bullet[];

    images: any;
    imgPath: string;

    lastDownTarget: any;

    controllerButtons: any;

    @ViewChild('mainCanvas') mainCanvas: ElementRef;
    context: CanvasRenderingContext2D;

    gameLoop: any;

    constructor(private flashMessage: FlashMessagesService,
      private router: Router,
      private authService: AuthService,
      private socketioService: SocketioService) { }

    ngAfterViewInit() {
        // if(!this.selection){
        //     this.context = (<HTMLCanvasElement>this.mainCanvas.nativeElement).getContext('2d');
        //     this.context.font = '30px Arial';
        // }
    }

    ngOnDestroy() {
      this.gameLoop.unsubscribe();
    }

    ngOnInit() {
      this.selection = true;
      this.selfId = null;
      this.tanksList = new Array();
      this.bulletsList = new Array();
      this.controllerButtons = this.authService.getOptionsFromLStorage();

      this.initializeImages();
      this.placeListeners();
    }

    drawMap(){
        this.context.drawImage(this.images.map, 0, 0);
    };

    drawCircle(){
        var radius = 45;

        var cx = this.tanksList[this.selfId].x;
        var cy = this.tanksList[this.selfId].y;

        var tankBodyImage = this.images.tankBodies[this.tanksList[this.selfId].imgNR - 1];
        var tankTowerImage = this.images.tankTowers[this.tanksList[this.selfId].imgNR - 1];

        var xPlayerPivot = this.tanksList[this.selfId].x + tankBodyImage.width / 2;
        var yPlayerPivot = this.tanksList[this.selfId].y + tankBodyImage.height / 2;

        this.context.shadowBlur = 30;
        this.context.shadowColor = "#77ff49";
        this.context.lineWidth = 2.5;
        this.context.strokeStyle = "#003300";
        this.context.beginPath();
        this.context.arc(xPlayerPivot, yPlayerPivot, radius, 0, 2 * Math.PI);
        this.context.stroke();

        this.context.shadowColor = "rgba(0, 0, 0, 0)";
    };

    drawScore(){
        this.context.fillStyle = 'black';
        this.context.fillText("Score: " + this.tanksList[this.selfId].score, 5, 30);
    };

    drawRemainingBullets(){
        this.context.fillStyle = 'black';
        this.context.fillText("Bullets: " + this.tanksList[this.selfId].curBullet, 5, 70);
    };

    drawReloading(){
        this.context.fillStyle = 'black';
        this.context.fillText("Reloading... ", 5, 110);
    };

    placeListeners(){
        this.socketioService.removeEventListener('initializeGame');
        this.socketioService.on('initializeGame', (data) => {
            if(this.selection)
                return;

            if(data.selfId){
                console.log("DataSelfID: " + data.selfId);
                this.selfId = data.selfId;
            }

            this.context = (<HTMLCanvasElement>this.mainCanvas.nativeElement).getContext('2d');
            this.context.font = '30px Arial';
            //console.log("Contextus: " + this.context);

            for(var i = 0; i < data.player.length; i++){
                this.tanksList[data.player[i].id] = new Tank(data.player[i], this.context, this.images);
            }

            for(var i = 0; i < data.bullet.length; i++){
                this.bulletsList[data.bullet[i].id] = new Bullet(data.bullet[i], this.context, this.images);
            }
        });

        this.socketioService.removeEventListener('update');
    	this.socketioService.on('update', (data) => {
            if(this.selection)
                return;
            //console.log("updateGame: ");

    		for(var i = 0; i < data.player.length; i++) {
    			var pack = data.player[i];
    			var p = this.tanksList[pack.id];
    			if(p){
    				if(pack.x !== undefined)
    					p.x = pack.x;
    				if(pack.y !== undefined)
    					p.y = pack.y;
    				if(pack.hp !== undefined)
    					p.hp = pack.hp;
    				if(pack.hpMax !== undefined)
    					p.hpMax = pack.hpMax;
    				if(pack.score !== undefined)
    					p.score = pack.score;
    				if(pack.tankAngle !== undefined)
    					p.tankAngle = pack.tankAngle;
    				if(pack.mouseAngle !== undefined)
    					p.mouseAngle = pack.mouseAngle;
    				if(pack.curBullet !== undefined)
    					p.curBullet = pack.curBullet;
    				if(pack.reloading !== undefined)
    					p.reloading = pack.reloading;
    				if(pack.imgNR !== undefined)
    					p.imgNR = pack.imgNR;
    				if(pack.canShoot !== undefined){
    						p.canShoot = pack.canShoot;
    				}
    			}
    		}

    		for(var i = 0; i < data.bullet.length; i++){
    			var pack = data.bullet[i];
    			var b = this.bulletsList[pack.id];

    			if(b){
    				if(pack.x !== undefined)
    					b.x = pack.x;
    				if(pack.y !== undefined)
    					b.y = pack.y;
    			}
    		}
    	});

    	this.socketioService.removeEventListener('remove');
    	this.socketioService.on('remove', (data) => {
            if(this.selection)
                return;
    		for(var i = 0; i < data.player.length; i++){
    			delete this.tanksList[data.player[i]];
    		}
    		for(var i = 0; i < data.bullet.length; i++){
    			delete this.bulletsList[data.bullet[i]];
    		}
    	});
    }

    initializeImages(){
        this.imgPath = '/assets/img/'

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

    play(){
        this.selection = false;

        //var controllerParameterObject = JSON.parse(controllerParameters);
		//controllerButtons = controllerParameterObject.controlButtons;

        var imgNR = 1;
        var tankBodyImage = this.images.tankBodies[imgNR - 1];
        this.socketioService.emit('startGame', {});
        this.socketioService.emit('playerImgData', {imgNR: imgNR, width:tankBodyImage.width, height:tankBodyImage.height});

        this.gameLoop = Observable.timer(0, 100).subscribe(() => {
            if(!this.selfId)
                return;

            let WIDTH = (<HTMLCanvasElement>this.mainCanvas.nativeElement).width;
      	    let HEIGHT = (<HTMLCanvasElement>this.mainCanvas.nativeElement).height;
            this.context.clearRect(0, 0, WIDTH, HEIGHT);
    		//drawMap();
    		this.drawCircle();
    		this.drawScore();
    		this.drawRemainingBullets();

    		if(this.tanksList[this.selfId].reloading)
    			this.drawReloading();

    		for(var i in this.tanksList){
    			this.tanksList[i].draw();
    		}
    		for(var i in this.bulletsList)
    			this.bulletsList[i].draw();
        });
    }

    @HostListener('document:keyup', ['$event'])
    keyUp(event){
        //if(this.lastDownTarget == this.mainCanvas.nativeElement) {
            if(event.keyCode == this.controllerButtons.rightCode)//68) //d
                this.socketioService.emit('keyPress', {inputId:'right', state:false});
            if(event.keyCode == this.controllerButtons.backwardCode)//83) //s
                this.socketioService.emit('keyPress', {inputId:'down', state:false});
            if(event.keyCode == this.controllerButtons.leftCode)//65) //a
                this.socketioService.emit('keyPress', {inputId:'left', state:false});
            if(event.keyCode ==this.controllerButtons.forwardCode) //87) //w
                this.socketioService.emit('keyPress', {inputId:'up', state:false});
            //if(event.keyCode == controllerButtons.attack)
            //    this.socketioService.emit('keyPress', {inputId:'attack', state:false});
        //}
    }

    @HostListener('document:keydown', ['$event'])
    keyDown(event){
        //if(this.lastDownTarget == this.mainCanvas.nativeElement) {
            if(event.keyCode == this.controllerButtons.rightCode)//68) //d
                this.socketioService.emit('keyPress', {inputId:'right', state:true});
            if(event.keyCode == this.controllerButtons.backwardCode)//83) //s
                this.socketioService.emit('keyPress', {inputId:'down', state:true});
            if(event.keyCode == this.controllerButtons.leftCode)//65) //a
                this.socketioService.emit('keyPress', {inputId:'left', state:true});
            if(event.keyCode ==this.controllerButtons.forwardCode) //87) //w
                this.socketioService.emit('keyPress', {inputId:'up', state:true});
    		//if(event.keyCode == controllerButtons.attack)
    			//this.socketioService.emit('keyPress', {inputId:'attack', state:true});
        //}
    }

    @HostListener('document:mousedown', ['$event'])
    mouseDown(event){
        //if(this.lastDownTarget == this.mainCanvas.nativeElement) {
            //this.lastDownTarget = event.target;
            this.socketioService.emit('keyPress', {inputId:'attack', state:true});
        //}
    }

    @HostListener('document:mouseup', ['$event'])
    mouseUp(event){
        //if(this.lastDownTarget == this.mainCanvas.nativeElement) {
            //if(controllerButtons.attack == 1){
                this.socketioService.emit('keyPress', {inputId:'attack', state:false});
            //}
        //}
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event) {
      let selfId = this.selfId;

      //selfID szukseges, h tudjuk, melyik jatekosrol beszelunk, az imgNR meg akkor nem nulla, ha a jatekos mar kivalasztott maganak egy tankot
      if(selfId != null && this.tanksList[selfId].imgNR != 0){

        var cx = this.tanksList[selfId].x + this.images.tankBodies[this.tanksList[selfId].imgNR - 1].width / 2;
        var cy = this.tanksList[selfId].y + this.images.tankBodies[this.tanksList[selfId].imgNR - 1].height / 2;

        //Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
        var radius = 80;

        // get mouse x/y
        var r = this.mainCanvas.nativeElement.getBoundingClientRect(),
            mx = event.clientX - r.left,
            my = event.clientY - r.top;

        // get diff. between mouse and circle center
        var dx = mx - cx,
            dy = my - cy,
            angle = Math.atan2(dy, dx);

        // get new point
        var x = cx + radius * Math.cos(angle),
            y = cy + radius * Math.sin(angle);

        // draw line to mouse
        //ctx.beginPath();
        //ctx.moveTo(cx, cy);
        //ctx.lineTo(mx, my);
        //ctx.stroke();

        // draw dot on new point
        //ctx.fillRect(x - 2, y - 2, 8, 8);
        this.socketioService.emit('keyPress', {inputId:'mouseAngle', state:angle / Math.PI * 180, x:x, y:y});
      }
    }

    onBackClick(){
        this.router.navigate(['/menu']);
    }

}
