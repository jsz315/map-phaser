import * as Phaser from 'phaser';
import {MapData} from './MapData'
import {ViewFactory} from './ViewFactory'
import { RectView } from './RectView';

export class Food extends Phaser.GameObjects.Container {

    static key:string = 'food'
    static path:string = 'food.png';
    
    startPot:any;

    view:Phaser.GameObjects.Image;

    constructor(scene:Phaser.Scene){
        super(scene)

        this.view = this.scene.add.image(0, 0, Food.key);
        this.add(this.view);
        this.view.setOrigin(0, 0);
        this.view.scale = 80 / this.view.width;

        this.view.setInteractive();
        
        scene.input.setDraggable(this.view);
        // scene.input.on('dragstart', (pointer:any, gameObject:any)=>{
            
        // })
        // scene.input.on('drag', (pointer:any, gameObject:any, dragX:any, dragY:any)=> {
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        // });
    }
}