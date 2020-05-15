import * as Phaser from 'phaser';
import {MapData} from './MapData'
import {ViewFactory} from './ViewFactory'

export class PenView extends Phaser.GameObjects.Container {

    static key:string = 'pen'
    static path:string = 'pen.png';

    view:Phaser.GameObjects.Image;
    tween:Phaser.Tweens.Tween;
    penScale:number;

    constructor(scene:Phaser.Scene){
        super(scene)

        this.view = this.scene.add.image(20, -30, PenView.key);
        this.view.setOrigin(1, 1);
        this.add(this.view);
        this.view.scale = 80 / this.view.width;
        this.view.alpha = 0;
    }

    hide(){
        this.fade(0);
    }

    fade(alpha:number){
        if(this.tween){
            this.tween.stop();
        }
        this.tween = this.scene.tweens.add({
            targets: this.view,
            alpha: alpha,
            delay: 0,
            duration: 120,
            autoStart: true
        })
    }

    show(){
        if(this.tween){
            this.tween.stop();
        }
        this.view.alpha = 1;
    }
}