export class Lobby {

    lobbyName: string;
    lobbyPassword: string;
    lobbyMap: number;
    lobbyMaxPlayer: number;
    lobbyCurPlayer:number;
    lobbyHostId: string;
    lobbyCurMaxPlayers: string;

    constructor(pLobbyName:string, pLobbyPassword:string,
        pLobbyMap:number, pLobbyMaxPlayer:number, pLobbyHostId:string,
        pLobbyCurPlayer:number){
        this.lobbyName = pLobbyName;
        this.lobbyPassword = pLobbyPassword;
        this.lobbyMap = pLobbyMap;
        this.lobbyMaxPlayer = pLobbyMaxPlayer;
        this.lobbyCurPlayer = pLobbyCurPlayer;
        this.lobbyHostId = pLobbyHostId;
        this.lobbyCurMaxPlayers = pLobbyCurPlayer+"/"+pLobbyMaxPlayer;
    }
}
