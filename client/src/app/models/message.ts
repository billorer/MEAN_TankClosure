export class Message {

    id: string;
    user: string;
    text: string;

    constructor(id, user, text){
        this.id = id;
        this.user = user;
        this.text = text;
    }
}
