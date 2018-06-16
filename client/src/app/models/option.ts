export class Option {
    //_id: string;
    forwardKey: string;
    backwardKey: string;
    leftKey: string;
    rightKey: string;
    attackKey: string;
    code: number;
    userId: string;

    constructor(//private pId:string,
        private pForwardKey:string,
        private pBackwardKey:string,private pLeftKey:string,
        private pRightKey:string,private pAttackKey:string,
        private pCode:number,private pUserId:string
    ){
    ///    this._id = pId;
        this.forwardKey = pForwardKey;
        this.backwardKey = pBackwardKey;
        this.leftKey = pLeftKey;
        this.rightKey = pRightKey;
        this.attackKey = pAttackKey;
        this.code = pCode;
        this.userId = pUserId;
    }
}
