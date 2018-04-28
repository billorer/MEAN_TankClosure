import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SocketioService } from '../../services/socketio.service';

import { Lobby } from '../../models/lobby';
import { Player } from '../../models/player';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    lobby: Lobby;
    lobbies: Lobby[];
    player: Player;
    players: Player[];

    lobbyList: boolean = true;

    constructor(private flashMessage: FlashMessagesService,
        private router: Router,
        private authService: AuthService,
        private socketioService: SocketioService
    ) { }

    initializeLocalVariables(){
        this.lobby = new Lobby("","",null,null,"-",null);
        this.lobbies = new Array();

        this.player = new Player("","","",null);
        this.players = new Array();
    }

    ngOnInit() {
        this.initializeLocalVariables();

        this.socketioService.removeEventListener('updateLobbiesList');
        this.socketioService.removeEventListener('updatePlayersList');
        this.socketioService.removeEventListener('kickLobbyPlayer');

        this.socketioService.emit('getLobbies',{});
        this.socketioService.on('updateLobbiesList', (data) => {
            console.log("UpdateLobbiesList: ");
            this.updateLobbiesList(data.lobbies);
        });
        this.socketioService.on('updatePlayersList', (data) => {
            console.log("UpdatePlayersList:");
            this.updatePlayersList(data.playersList);
        });
        this.socketioService.on('kickLobbyPlayer', (data) => {
            console.log(data.msg);
            this.lobbyList = true;
            this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        });
    }

    onLobbySubmit(){
        // We add the lobbyHostId here, the rest is filled by the form
        this.lobby.lobbyHostId = this.socketioService.getId();

        // Send the new lobby and close the modal
        this.socketioService.emit('createLobby', {lobby: this.lobby});
        this.flashMessage.show('The lobby has been created!', {cssClass: 'alert-success', timeout: 3000});
    }

    updateLobbiesList(lobbiesList){
        this.lobbies = [];
        for (let lobby in lobbiesList){
            if(lobbiesList.hasOwnProperty(lobby)){
                this.lobbies.push(lobbiesList[lobby]);
                console.log("LobbyId: "+lobbiesList[lobby].lobbyHostId + " CurPlayers: " + lobbiesList[lobby].lobbyCurPlayer);
            }
        }
    }

    updatePlayersList(playersList){
        this.players = [];
        for (let curPlayer in playersList){
            if(playersList.hasOwnProperty(curPlayer)){
                this.players.push(playersList[curPlayer]);
                console.log("PlayerId: "+playersList[curPlayer].playerId);
            }
        }
    }

    onJoinLobbyClick(pHostId){
        this.socketioService.removeEventListener('joinSuccess');
        this.socketioService.removeEventListener('joinUnSuccess');
        this.socketioService.removeEventListener('joinLobby');

        this.player = new Player(pHostId, this.socketioService.getId(), this.authService.getUserNameFromLStorage(), false);

        this.socketioService.emit('joinLobby', {newPlayer: this.player});

        this.socketioService.on('joinSuccess', (data) => {
            console.log("Player joined successfully:");
            this.lobbyList = false;
            this.flashMessage.show('You joined the lobby!', {cssClass: 'alert-success', timeout: 3000});
        });
        this.socketioService.on('joinUnSuccess', (data) => {
            console.log("Player faild to join:");
            this.flashMessage.show('The lobby is full!', {cssClass: 'alert-danger', timeout: 3000});
        });
    }

    onPlayerReadyClick(playerId, hostId, playerStatus){
        if(playerStatus) {
            this.socketioService.emit('playerReady', {hostId: hostId, playerId: playerId, playerState: false});
        } else {
            this.socketioService.emit('playerReady', {hostId: hostId, playerId: playerId, playerState: true});
        }
    }

    onLeaveClick(playerId, hostId){
        console.log("Leave lobby: " + playerId + " " + hostId);
        this.socketioService.emit('leaveLobby',{hostId: hostId, playerId: playerId});
        this.lobbyList = true;
    }

    startMatch() {
        for (let curPlayer in this.players){
            if(this.players.hasOwnProperty(curPlayer)){
                if(this.players[curPlayer].playerStatus === false){
                    return;
                }
            }
        }
        console.log("The match has been started!");
    }

    onBackClick(){
      this.router.navigate(['/dashboard']);
    }
}
