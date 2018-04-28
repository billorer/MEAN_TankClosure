export class Player {

    playerLobbyHostId: string;
    playerId: string;
    playerName: string;
    playerStatus: boolean;

    constructor(pPlayerLobbyHostId:string, pPlayerId:string, pPlayerName:string, pPlayerStatus:boolean){
        this.playerLobbyHostId = pPlayerLobbyHostId;
        this.playerId = pPlayerId;
        this.playerName = pPlayerName;
        this.playerStatus = pPlayerStatus;
    }
}
