import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client'
import  { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketioService {

    private socket;

    constructor() {
        this.socket = socketIo(environment.api_url);
    }

    on(eventName:any, callback:any){
        this.socket && this.socket.on(eventName, (data) => {
            callback(data);
        });
    }

    emit(eventName:any, data:any){
        this.socket && this.socket.emit(eventName, data);
    }

    removeEventListener(eventName: any){
        this.socket && this.socket.removeEventListener(eventName);
    }

    getId() {
        return this.socket.id;
    }

    getNsps() {
        return this.socket.nsp;
    }
}
