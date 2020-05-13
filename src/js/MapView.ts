import * as Phaser from 'phaser';
import {MapData} from './MapData'
import {ViewFactory} from './ViewFactory'

export class MapView extends Phaser.GameObjects.Container {

    mapData:MapData;
    views:any;
    size:number;

    static COLOR_BLOCK:number = 0x000000;
    static COLOR_FREE:number = 0xffffff;
    static COLOR_AIM:number = 0xff0000;
    static COLOR_PLAYER:number = 0xff8844;

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

    changeType(i:number, j:number, type:number){
      if(i >= 0 && i < this.mapData.col){
        if(j >= 0 && j < this.mapData.row){
          this.mapData.points[i][j].type = type;
          this.update();
        }
      }
    }

    setFree(i:number, j:number){
        if(this.mapData.points[i] && this.mapData.points[i][j]){
            this.mapData.points[i][j].type = MapData.TYPE_FREE;
            this.update();
        }
    }

    setBlock(i:number, j:number){
        if(this.mapData.points[i] && this.mapData.points[i][j]){
            this.mapData.points[i][j].type = MapData.TYPE_BLOCK;
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
      var color:number = 0;
      switch(this.mapData.points[i][j].type){
        case MapData.TYPE_FREE:
          color = MapView.COLOR_FREE;
          break
        case MapData.TYPE_BLOCK:
          color = MapView.COLOR_BLOCK;
          break
        case MapData.TYPE_AIM:
          color = MapView.COLOR_AIM;
          break
        case MapData.TYPE_PLAYER:
          color = MapView.COLOR_PLAYER;
          break
      }
      return color;
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