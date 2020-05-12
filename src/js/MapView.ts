import * as Phaser from 'phaser';
import {MapData} from './MapData'
import {ViewFactory} from './ViewFactory'

export class MapView extends Phaser.GameObjects.Container {

    mapData:MapData;
    views:any;
    size:number;

    static COLOR_BLOCK:number = 0x000000;
    static COLOR_FREE:number = 0xffffff;

    constructor(scene:Phaser.Scene, width:number, height:number, size:number){
        super(scene);
        this.width = width;
        this.height = height;
        this.size = size;
        var col = Math.ceil(width / this.size);
        var row = Math.ceil(height / this.size);
        this.mapData = new MapData(row, col, this.size);
        this.createViews();
    }

    setFree(i:number, j:number){
        if(this.mapData.data[i] && this.mapData.data[i][j]){
            this.mapData.data[i][j] = MapData.TYPE_FREE;
            this.update();
        }
    }

    setBlock(i:number, j:number){
        if(this.mapData.data[i] && this.mapData.data[i][j]){
            this.mapData.data[i][j] = MapData.TYPE_BLOCK;
            this.update();
        }
    }

    createViews(){
        this.views = [];
        for(var i = 0; i < this.mapData.row; i++){
            this.views[i] = [];
            for(var j = 0; j < this.mapData.col; j++){
                var view = ViewFactory.makeRect(this.scene, this.getColor(i, j), this.size, this.size);
                view.x = j * this.size;
                view.y = i * this.size;
                this.views[i][j] = view;
                this.add(view);
            }
        }
        this.update();
    }

    getColor(i:number, j:number):number{
        if(this.mapData.data[i][j] == MapData.TYPE_BLOCK){
            return MapView.COLOR_BLOCK;
        }
        return MapView.COLOR_FREE;
    }

    update(){
        for(var i = 0; i < this.mapData.row; i++){
            for(var j = 0; j < this.mapData.col; j++){
                // this.views[i][j].fillColor = Math.floor(Math.random() * 0xffffff);
                this.views[i][j].fillColor = this.getColor(i, j);
            }
        }
    }

}