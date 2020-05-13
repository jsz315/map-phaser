import { Point } from "./Point";

export class MapData{
    
    static TYPE_FREE:number = 0;
    static TYPE_BLOCK:number = 1;
    static TYPE_AIM:number = 2;
    static TYPE_PLAYER:number = 3;

    row:number;
    col:number;
    size:number;
    // data:any;

    points:Array<Array<Point>> = [];

    constructor(row:number, col:number, size:number){
        this.row = row;
        this.col = col;
        this.size = size;
        this.reset();
        console.log("MapData init");
    }

    reset(){
        // this.data = [];
        this.points = [];
        for(var i = 0; i < this.col; i++){
            // this.data[i] = [];
            this.points[i] = [];
            for(var j = 0; j < this.row; j++){
                // this.data[i][j] = MapData.TYPE_BLOCK;
                this.points[i][j] = new Point(i, j);
                this.points[i][j].type = MapData.TYPE_BLOCK;
            }
        }
    }

    find(type:number):any{
        for(var i = 0; i < this.col; i++){
            for(var j = 0; j < this.row; j++){
                if(this.points[i][j].type == type){
                    return this.points[i][j];
                }
            }
        }
        return null;
    }

}