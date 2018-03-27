import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { SocketioService } from '../../services/socketio.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    //lobby: any;
    lobbyName: String;
    lobbyPassword: String;
    lobbyMap: Number;
    lobbyMaxPlayer: Number;
    lobbyHostId: String;

    constructor(private flashMessage: FlashMessagesService,
        private router: Router,
        private authService: AuthService,
        private socketioService: SocketioService
    ) { }

    ngOnInit() {
        // this.lobbyName = "";
        // this.lobbyPassword = "";
        // this.lobbyMap = 0;
        // this.lobbyMaxPlayer = 0;
        // this.lobbyHostId = "";
    }

    onLobbySubmit(){
        const lobby = {
            lobbyName: this.lobbyName,
            lobbyPassword: this.lobbyPassword,
            lobbyMap: this.lobbyMap,
            lobbyMaxPlayer: this.lobbyMaxPlayer,
            lobbyHostId: this.authService.getUserIdFromLStorage(),
        }
        const socket = this.socketioService.getSocketObject();
        socket.emit('createLobby', {lobby: lobby});
        //angular.element('#lobbyCreateModal');
    }

      onBackClick(){
          this.router.navigate(['/dashboard']);
      }
}
