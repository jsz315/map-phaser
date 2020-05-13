export class MapData{

    row:number;
    col:number;
    size:number;
    data:any;

    static TYPE_FREE:number = 0;
    static TYPE_BLOCK:number = 1;
    static TYPE_AIM:number = 2;
    static TYPE_PLAYER:number = 3;

    constructor(row:number, col:number, size:number){
        this.row = row;
        this.col = col;
        this.size = size;
        this.reset();
        console.log("MapData init");
    }

    reset(){
        this.data = [];
        for(var i = 0; i < this.row; i++){
            this.data[i] = [];
            for(var j = 0; j < this.col; j++){
                this.data[i][j] = MapData.TYPE_BLOCK;
            }
        }
    }

}