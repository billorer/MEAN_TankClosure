import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ImagesService } from '../../services/images.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SocketioService } from '../../services/socketio.service';
import { environment } from '../../../environments/environment';

import { Observable } from "rxjs";

import { Tank } from '../../models/tank';
import { Bullet } from '../../models/bullet';
import { Message } from '../../models/message';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
    selfId: string;
    lobbyHostId: string;

    images:any;

    tanksList: Tank[];
    bulletsList: Bullet[];

    controllerButtons: any;

    @ViewChild('mainCanvas') mainCanvas: ElementRef;
    context: CanvasRenderingContext2D;
    canvasHeight: number;
    canvasWidth: number;

    gameLoop: any;

    gameTime: number;

    messages: Message[];
    messageText: string;

    constructor(private flashMessage: FlashMessagesService,
      private router: Router,
      private authService: AuthService,
      private socketioService: SocketioService,
      private imagesService: ImagesService) { }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
      if(this.lobbyHostId != null && this.selfId != null){
          this.socketioService.emit('leaveLobby',{hostId: this.lobbyHostId, playerId: this.selfId});
      }

      this.gameLoop.unsubscribe();
      this.socketioService.removeEventListener('lobbyHost');
      this.socketioService.removeEventListener('update');
      this.socketioService.removeEventListener('initializeGame');
      this.socketioService.removeEventListener('remove');
      this.socketioService.removeEventListener('explosion');
      this.socketioService.removeEventListener('gameOver');
      this.socketioService.removeEventListener('updateMessagesList');
    }

    ngOnInit() {
      this.selfId = null;
      this.lobbyHostId = null;
      this.messageText = null;
      this.tanksList = new Array();
      this.bulletsList = new Array();
      this.messages = new Array();

      this.controllerButtons = this.authService.getOptionsFromLStorage();

      this.images = this.imagesService.getImages();

      this.initializeCanvas();
      this.initializeGameListeners();

      var date = new Date(); // Generate a timestamp when you need to start countdown

      //start the gameloop
      this.startGameLoop();
    }

    initializeCanvas(){
        this.context = (<HTMLCanvasElement>this.mainCanvas.nativeElement).getContext('2d');
        this.context.font = '30px Arial';
        this.canvasWidth = (<HTMLCanvasElement>this.mainCanvas.nativeElement).width;
        this.canvasHeight = (<HTMLCanvasElement>this.mainCanvas.nativeElement).height;


        this.context.webkitImageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false; //future
    }

    // drawMap(){
    //     this.context.drawImage(this.images.map, 0, 0);
    // };

    drawCircle(){
        var cx = this.tanksList[this.selfId].x;
        var cy = this.tanksList[this.selfId].y;

        var tankBodyImage = this.images.tankBodies[this.tanksList[this.selfId].imgNR];
        var tankTowerImage = this.images.tankTowers[this.tanksList[this.selfId].imgNR];

        var xPlayerPivot = this.tanksList[this.selfId].x + tankBodyImage.width / 2;
        var yPlayerPivot = this.tanksList[this.selfId].y + tankBodyImage.height / 2;

        this.context.shadowBlur = 30;
        this.context.shadowColor = "#77ff49";
        this.context.lineWidth = 2.5;
        this.context.strokeStyle = "#003300";
        this.context.beginPath();
        this.context.arc(xPlayerPivot, yPlayerPivot, environment.tankCircleRadius, 0, 2 * Math.PI);
        this.context.stroke();

        this.context.shadowColor = "rgba(0, 0, 0, 0)";
    };

    // drawScore(){
    //     this.context.fillStyle = 'black';
    //     this.context.fillText("Score: " + this.tanksList[this.selfId].score, 5, 30);
    // };
    //
    // drawRemainingBullets(){
    //     this.context.fillStyle = 'black';
    //     this.context.fillText("Bullets: " + this.tanksList[this.selfId].curBullet, 5, 70);
    // };
    //
    // drawReloading(){
    //     this.context.fillStyle = 'black';
    //     this.context.fillText("Reloading... ", 5, 110);
    // };

    initializeGameListeners(){

        this.socketioService.removeEventListener('gameTime');
        this.socketioService.on('gameTime', (data) => {
            this.gameTime = data;
        });

        this.socketioService.removeEventListener('kickLobbyPlayer');
        this.socketioService.on('kickLobbyPlayer', (data) => {
            console.log(data.msg);
            this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
            this.router.navigate(['/menu']);
        });

        this.socketioService.on('lobbyHost', (data) => {
            this.lobbyHostId = data.lobbyHostId;
        });

        this.socketioService.on('updateMessagesList', (data) => {
            this.messages = new Array();
            for(let i = 0; i < data.messages.length; i++){
                this.messages.push(new Message(i, data.messages[i].user, data.messages[i].text));
            }
        });

        this.socketioService.on('initializeGame', (data) => {
            let thisSocketId = this.socketioService.getId();
            for(let i = 0; i < data.player.length; i++){
                if(data.player[i].id == thisSocketId){
                    this.selfId = thisSocketId;
                }
                this.tanksList[data.player[i].id] = new Tank(data.player[i], this.context, this.images);
            }
            for(let i = 0; i < data.bullet.length; i++){
                this.bulletsList[data.bullet[i].id] = new Bullet(data.bullet[i], this.context, this.images);
            }
        });

    	this.socketioService.on('update', (data) => {
    		for(let i = 0; i < data.player.length; i++) {
    			let pack = data.player[i];
    			let p = this.tanksList[pack.id];
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

    		for(let i = 0; i < data.bullet.length; i++){
    			let pack = data.bullet[i];
    			let b = this.bulletsList[pack.id];

    			if(b){
    				if(pack.x !== undefined)
    					b.x = pack.x;
    				if(pack.y !== undefined)
    					b.y = pack.y;
    			}
              }
    	});

    	this.socketioService.on('remove', (data) => {
    		for(let i = 0; i < data.player.length; i++){
    			delete this.tanksList[data.player[i]];
    		}
    		for(let i = 0; i < data.bullet.length; i++){
    			delete this.bulletsList[data.bullet[i]];
    		}
    	});

        this.socketioService.on('explosion', (data) => {
            //explosion(data);
            this.socketioService.emit('reset', {data: data});
        });
        this.socketioService.on('gameOver', (data) => {
            console.log("GAME OVER");
            //leave the gameloop
            this.gameLoop.unsubscribe();
            //let newScore = this.tanksList[this.selfId].score + this.authService.getUserScoreFromLStorage();
            //console.log(this.tanksList[this.selfId].score);
            //console.log(this.authService.getUserScoreFromLStorage());
            let userData = {
                newUserScore: this.tanksList[this.selfId].score,
                username: this.authService.getUserNameFromLStorage()
            };

            this.authService.updateUserScore(userData).subscribe(data => {
                if(data.success){
                    this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
                } else {
                    this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
                }
            });
            this.router.navigate(['/menu']);
        });
    }

    startGameLoop(){
        //Timer's first argument: after how much time should it started
        //Timer's second argument: after how much time should it repeat itself
        this.gameLoop = Observable.timer(0, environment.gameFps).subscribe(() => {
            if(!this.selfId)
                return;
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    		this.drawCircle();

    		for(var i in this.tanksList){
    			this.tanksList[i].draw();
    		}
            //console.log(this.bulletsList);
    		for(var i in this.bulletsList)
    			this.bulletsList[i].draw();
        });
    }

    sendMessage(){
        let userName = this.authService.getUserNameFromLStorage();
        console.log("Message: " + this.messageText);
        this.socketioService.emit('chatMessage', {user:userName, text:this.messageText});
        this.messageText = "";
    }

    /////////////////////////////////////////////////////
    /////////////LISTENERS///////////////////////////////
    /////////////////////////////////////////////////////
    @HostListener('document:keyup', ['$event'])
    keyUp(event){
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
    }

    @HostListener('document:keydown', ['$event'])
    keyDown(event){
        //console.log(event);
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

    }

    @HostListener('document:mousedown', ['$event'])
    mouseDown(event){
        // we update the mouseangle then we attack
        this.updateMouseAngleAndPosition(event, true);
    }

    @HostListener('document:mouseup', ['$event'])
    mouseUp(event){
        this.socketioService.emit('keyPress', {inputId:'attack', state:false});
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event) {
        this.updateMouseAngleAndPosition(event, false);
    }

    updateMouseAngleAndPosition(event, attack){
        //selfID szukseges, h tudjuk, melyik jatekosrol beszelunk
        if(this.selfId != null){

          let cx = this.tanksList[this.selfId].x + this.images.tankBodies[this.tanksList[this.selfId].imgNR].width / 2;
          let cy = this.tanksList[this.selfId].y + this.images.tankBodies[this.tanksList[this.selfId].imgNR].height / 2;

          // get mouse x/y
          let r = this.mainCanvas.nativeElement.getBoundingClientRect(),
              mx = event.clientX - r.left,
              my = event.clientY - r.top;

          // get diff. between mouse and circle center
          let dx = mx - cx,
              dy = my - cy,
              angle = Math.atan2(dy, dx);

          // get new point
          let x = cx + environment.tankTowerRadius * Math.cos(angle),
              y = cy + environment.tankTowerRadius * Math.sin(angle);

          this.socketioService.emit('keyPress', {inputId:'mouseAngle', state:angle / Math.PI * 180, x:x, y:y});

          attack && this.socketioService.emit('keyPress', {inputId:'attack', state:true});
        }
    }

    onBackClick(){
        this.router.navigate(['/menu']);
    }
}
