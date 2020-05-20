import * as Phaser from 'phaser';
import {MapData} from './MapData'
import {ViewFactory} from './ViewFactory'
import { MapView } from './MapView';

export class RectView extends Phaser.GameObjects.Container {

    size:number;
    startTxt:Phaser.GameObjects.Text;
    endTxt:Phaser.GameObjects.Text;
    costTxt:Phaser.GameObjects.Text;
    color:number;
    background:Phaser.GameObjects.Polygon;
    wall:Phaser.GameObjects.Image;
    graphics: Phaser.GameObjects.Graphics;
    constructor(scene:Phaser.Scene, size:number, color:number){
        super(scene);
        this.color = color;
        this.size = size;
        this.createViews();


       
        this.graphics = new Phaser.GameObjects.Graphics(scene);
        this.graphics.fillStyle(0x550033, 0.2);
        this.graphics.fillRect(0, 0, size / 1.2, size / 1.2);
        // this.graphics.createBitmapMask();
        this.graphics.createBitmapMask(this.background);
        // this.graphics.setTexture('wall', 0, 2);
        
        this.add(this.graphics);

        this.graphics.x = 4;
        this.graphics.y = 4;
    }

    changeColor(color:number){
        this.color = color;
        this.background.fillColor = color;
        if(this.color == MapView.COLOR_BLOCK){
            this.wall.visible = true;
        }
        else{
            this.wall.visible = false;
        }
    }

    changeNumber(s:number, e:number, c:number){
        this.startTxt.text = s.toString();
        this.endTxt.text = e.toString();
        this.costTxt.text = c.toString();
    }

    createViews(){
        this.background = ViewFactory.makeRect(this.scene, this.color, this.size, this.size);
        this.startTxt = ViewFactory.makeText(this.scene, '0', "#229922", 16, "left");
        this.endTxt = ViewFactory.makeText(this.scene, '0', "#666666", 16, "right");
        this.costTxt = ViewFactory.makeText(this.scene, '0', "#ff0000", 20, "left");

        this.wall = ViewFactory.makeImage(this.scene, 'wall');

        this.add(this.background);
        this.add(this.startTxt);
        this.add(this.endTxt);
        this.add(this.costTxt);
        this.add(this.wall);
        this.wall.visible = false;
        

        this.startTxt.x = 12;
        this.startTxt.y = this.size - 16;

        this.endTxt.x = this.size - 12;
        this.endTxt.y = this.size - 16;

        this.costTxt.x = 12;
        this.costTxt.y = 18;

        this.wall.scale = this.size / this.wall.width;
    }
}