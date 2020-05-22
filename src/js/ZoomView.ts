import * as Phaser from 'phaser';
import {MapData} from './MapData'
import {ViewFactory} from './ViewFactory'
import { RectView } from './RectView';

export class ZoomView extends Phaser.GameObjects.Container {

    view:Phaser.GameObjects.Image;
    line:Phaser.GameObjects.Graphics;

    constructor(scene:Phaser.Scene){
        super(scene)

        this.line = this.scene.add.graphics();
        this.line.lineStyle(1, 0x999999);
        this.line.fillStyle(0x330099);
        this.line.fillRoundedRect(0, 0, 10, 100, 5);
        this.add(this.line);

        this.view = this.scene.add.image(0, 0, 'wall');
        this.view.scale = 90 / this.view.width;
        // this.view.lineStyle(1, 0x009999);
        // this.view.fillStyle(0x118899);
        // this.view.fillRoundedRect(0, 0, 20, 20, 10);
        this.add(this.view);


        // this.view = this.scene.add.image(0, 0, Player.key);
        // this.add(this.view);
        // this.view.setOrigin(0, 0);
        // this.view.input.enabled = true;
       
        this.view.setInteractive();
        scene.input.setDraggable(this.view);
        

        this.view.on('drag', (pointer:any, gameObject:any, dragX:any, dragY:any)=> {
            this.view.y = dragY;
        });
    }
}