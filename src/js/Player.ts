import * as Phaser from 'phaser';
import {MapData} from './MapData'
import {ViewFactory} from './ViewFactory'
import { RectView } from './RectView';

export class Player extends Phaser.GameObjects.Container {

    static key:string = 'dog'
    static path:string = 'dog.png';

    view:Phaser.GameObjects.Image;

    constructor(scene:Phaser.Scene){
        super(scene)

        this.view = this.scene.add.image(0, 0, Player.key);
        this.add(this.view);
        this.view.setOrigin(0, 0);
        this.view.scale = 80 / this.view.width;
    }
}