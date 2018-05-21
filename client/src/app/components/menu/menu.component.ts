import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ImagesService } from '../../services/images.service';
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

    lobbyPass: string;
    imgNr: number;

    constructor(private flashMessage: FlashMessagesService,
        private router: Router,
        private authService: AuthService,
        private socketioService: SocketioService,
        private imagesService: ImagesService
    ) { }

    initializeLocalVariables(){
        this.lobby = new Lobby("","",null,null,"-",null,null);
        this.lobbies = new Array();

        this.player = new Player("","","",null);
        this.players = new Array();
    }

    ngOnInit() {
        this.initializeLocalVariables();
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
        this.socketioService.on('navigateToCanvas', (data) => {
            this.router.navigate(['/game']);
            console.log("The match has been started!");
        });
    }

    ngOnDestroy() {
        this.socketioService.removeEventListener('navigateToCanvas');
        this.socketioService.removeEventListener('updateLobbiesList');
        this.socketioService.removeEventListener('updatePlayersList');
        this.socketioService.removeEventListener('kickLobbyPlayer');

        this.socketioService.removeEventListener('joinSuccess');
        this.socketioService.removeEventListener('joinUnSuccess');
        this.socketioService.removeEventListener('joinLobby');
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
            if(lobbiesList.hasOwnProperty(lobby) && !lobbiesList[lobby].lobbyInGame){
                this.lobbies.push(lobbiesList[lobby]);
                console.log("LobbyId: "+lobbiesList[lobby].lobbyHostId + " CurPlayers: " + lobbiesList[lobby].lobbyCurPlayer);
            } else{
                console.log("InGameLobby: "+lobbiesList[lobby].lobbyHostId + " CurPlayers: " + lobbiesList[lobby].lobbyCurPlayer);
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

    onJoinSubmit(pHostId, pLobbyPassword, index){
        if(this.lobbyPass == pLobbyPassword){
            this.joinLobby(pHostId);
        }
        else{
            console.log("Player faild to join: bad password!");
            this.flashMessage.show('The lobby password is incorrect!', {cssClass: 'alert-danger', timeout: 3000});
        }
        this.lobbies[index].showPassForm = false;
    }

    onJoinLobbyClick(pHostId, pLobbyPassword, index){
        if(pLobbyPassword){
            this.lobbies[index].showPassForm = true;
        }else{
            this.joinLobby(pHostId);
        }
    }

    joinLobby(pHostId){
        this.player = new Player(pHostId, this.socketioService.getId(), this.authService.getUserNameFromLStorage(), false);
        this.socketioService.emit('joinLobby', {newPlayer: this.player});
        this.socketioService.on('joinSuccess', (data) => {
            console.log("Player joined successfully:");
            this.lobbyList = false;
            this.flashMessage.show('You joined the lobby!', {cssClass: 'alert-success', timeout: 3000});
        });
        this.socketioService.on('joinUnSuccess', (data) => {

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

    chosenTank(pImgNr){
        this.imgNr = pImgNr;
    }

    startMatch() {
        if(this.checkIfAPlayerNotReady())
            return;
        let tankBodyImage = this.imagesService.getImages().tankBodies[this.imgNr];
        this.socketioService.emit('startGame', {lobbyId: this.lobby.lobbyHostId, playerImgData: { imgNR: this.imgNr, width:tankBodyImage.width, height:tankBodyImage.height } });
    }

    // Iterates through the players and returns true, if someone's not ready
    checkIfAPlayerNotReady(){
        for (let curPlayer in this.players){
            if(this.players.hasOwnProperty(curPlayer)){
                if(this.players[curPlayer].playerStatus === false){
                    return true;
                }
            }
        }
        return false;
    }

    onBackClick(){
      this.router.navigate(['/dashboard']);
    }
}
