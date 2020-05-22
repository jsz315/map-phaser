import * as Phaser from 'phaser';
import listener from "./listener.js";
import { ViewFactory } from './ViewFactory'
import Tooler from './tooler';
import { MapView } from './MapView';
import { MapData } from './MapData';
import { ShortPath } from './ShortPath';
import { Point } from './Point';
import { PenView } from './PenView';
import { Player } from './Player';
import { Food } from './Food';
import { ZoomView } from './ZoomView';

export class StartScene extends Phaser.Scene {
    stage: Phaser.GameObjects.Polygon;
    stageWidth: number;
    stageHeight: number;
    stageColor: number = 0xffffff;
    stageScale: number = 1;
    stageX: number = 0;
    stageY: number = 0;
    centerX: number = 0;
    centerY: number = 0;
    container: Phaser.GameObjects.Container;
    curView: any;
    sx: number = 0;
    sy: number = 0;
    drawing: boolean = false;
    rects: any[] = [];
    center: any = {};
    offset: any = {};
    size: number = 750 / 9;
    mapView: MapView;
    player: Player;
    food: Food;
    clickType: number = MapData.TYPE_FREE;
    shortPath: ShortPath;
    penView:PenView;
    zoomView:ZoomView;

    startPoint: any;

    scaleView:Phaser.GameObjects.Image;

    constructor() {
        super({
            key: 'StartScene'
        })
    }

    init(params: any): void {

    }

    preload(): void {
        // this.load.setBaseURL('http://labs.phaser.io');
        // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.setBaseURL('/');
        this.load.image(PenView.key, PenView.path);
        this.load.image('wall', 'wall.jpg');
        this.load.image(Food.key, Food.path);
        this.load.image(Player.key, Player.path);
    }

    create(): void {
        this.stageWidth = Number(this.game.config.width);
        this.stageHeight = Number(this.game.config.height);
        this.container = this.add.container(0, 0);

        this.mapView = new MapView(this, this.stageWidth, this.stageHeight, this.size);
        this.container.add(this.mapView);

        this.shortPath = new ShortPath(this.mapView.mapData);
        this.addEvent();

        this.penView = new PenView(this);
        this.add.container(40, 40, this.penView);

        this.player = new Player(this);
        this.container.add(this.player);

        this.food = new Food(this);
        this.container.add(this.food);

        this.input.on("drag", (pointer:any, gameObject:any, dragX:any, dragY:any)=>{
            console.log(dragY, 'dragY', gameObject);
            if(gameObject == this.zoomView.view){
                console.log("zoom");
            }
            else if(gameObject == this.scaleView){

                var h = this.stageHeight / 2;
                if(dragY - h > 0){
                    this.onScale(this.container.scale * 1.12);
                }
                else{
                    this.onScale(this.container.scale * 0.9);
                }
            }
            else{
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
            
        })

        this.input.on('pointerdown', (data:any)=>{
            var e = data.event.changedTouches;
            this.startPoint = {
                x: e[0].clientX,
                y: e[0].clientY
            }
        })

        this.input.on('pointermove', (data:any)=>{
            var e = data.event.changedTouches;
            if(e.length == 2){
                console.log("pointermove", data);
                this.container.x += e[0].clientX - this.startPoint.x;
                this.container.y += e[0].clientY - this.startPoint.y;
               
                this.startPoint = {
                    x: e[0].clientX,
                    y: e[0].clientY
                }
            }
        })


        this.input.on('pointerup', (data:any)=>{
            var e = data.event.changedTouches;
            if(e.length == 2){
                console.log(data);
            }
            this.startPoint = null;
        })


        // console.log(this.mapView, 'mapView');
        // console.log(this.player, 'player');

        // this.cameras.main.setBounds(0, 0, 1024, 1024);
        // this.cameras.main.centerOn(0, 0);
        // this.cameras.main.setBackgroundColor(0x993300);
        // console.log('camera', this.cameras);

        this.scaleView = this.add.image(300, 200, Food.key);
        this.scaleView.scale = 80 / this.scaleView.width;
        this.scaleView.x = this.stageWidth - 100;
        this.scaleView.y = this.stageHeight / 2;
        // this.scaleView.setScrollFactor(0, 0);
        this.scaleView.setInteractive();
        this.input.setDraggable(this.scaleView);


        this.zoomView = new ZoomView(this);
        this.add.container(200, 100, this.zoomView);
    }

    onScale(num:number){
        
        if(num > 0.2 && num < 4){
            this.stageScale = num;
            // this.cameras.main.setZoom(num);
            this.container.scale = num;
        }
        
        // console.log(num);
        // var oldX = this.container.scale * this.stageWidth;
        // var oldY = this.container.scale * this.stageHeight;
        // this.container.scale = num;
        // var newX = this.container.scale * this.stageWidth;
        // var newY = this.container.scale * this.stageHeight;

        // var center = this.worldToContainer(sx, sy);

        // var offsetX = 0.5;
        // var offsetY = 0.5;
        // console.log(offsetX, offsetY);
        // this.container.x -= (newX - oldX) * offsetX;
        // this.container.y -= (newY - oldY) * offsetY;
        // this.offset = { x: offsetX, y: offsetY };
        /*

        var oldX = this.container.scale * this.stageWidth;
        var oldY = this.container.scale * this.stageHeight;
        // this.container.scale = this.stageScale * num;
        this.container.scale = num;
        var newX = this.container.scale * this.stageWidth;
        var newY = this.container.scale * this.stageHeight;
        // this.container.x -= (newX - oldX) / 2;
        // this.container.y -= (newY - oldY) / 2;

        var offsetX = (this.centerX - this.container.x) / this.stageWidth;
        var offsetY = (this.centerY - this.container.y) / this.stageHeight;
        // console.log(offsetX, offsetY);
        this.container.x -= (newX - oldX) * offsetX;
        this.container.y -= (newY - oldY) * offsetY;
        */

        // if (e.clientX == this.center.x && e.clientY == this.center.y) {
        //     this.container.x -= (newX - oldX) * this.offset.x;
        //     this.container.y -= (newY - oldY) * this.offset.y;
        // }
        // else {
        //     console.log(this.game.canvas.offsetLeft, this.game.canvas.offsetTop, "offset")
        //     var sx = e.clientX - this.game.canvas.offsetLeft;
        //     var sy = e.clientY - this.game.canvas.offsetTop;
        //     var center = this.worldToContainer(sx, sy);

        //     var offsetX = center.x / this.stageWidth;
        //     var offsetY = center.y / this.stageHeight;
        //     console.log(offsetX, offsetY);
        //     this.container.x -= (newX - oldX) * offsetX;
        //     this.container.y -= (newY - oldY) * offsetY;
        //     this.offset = { x: offsetX, y: offsetY };
        // }

        // this.center = { x: e.clientX, y: e.clientY };
    }

    addEvent() {
        window.addEventListener("mousewheel", (e: any) => {
            // var oldX = this.container.scale * this.stageWidth;
            // var oldY = this.container.scale * this.stageHeight;
            listener.emit("center", e.clientX, e.clientY);

            if (e.deltaY > 0) {
                // this.container.scale *= 0.9;
                this.onScale(this.stageScale * 0.9);
            }
            else {
                // this.container.scale *= 1.1;
                this.onScale(this.stageScale * 1.1);
            }
            /*
            var newX = this.container.scale * this.stageWidth;
            var newY = this.container.scale * this.stageHeight;

            if (e.clientX == this.center.x && e.clientY == this.center.y) {
                this.container.x -= (newX - oldX) * this.offset.x;
                this.container.y -= (newY - oldY) * this.offset.y;
            }
            else {
                console.log(this.game.canvas.offsetLeft, this.game.canvas.offsetTop, "offset")
                var sx = e.clientX - this.game.canvas.offsetLeft;
                var sy = e.clientY - this.game.canvas.offsetTop;
                var center = this.worldToContainer(sx, sy);

                var offsetX = center.x / this.stageWidth;
                var offsetY = center.y / this.stageHeight;
                console.log(offsetX, offsetY);
                this.container.x -= (newX - oldX) * offsetX;
                this.container.y -= (newY - oldY) * offsetY;
                this.offset = { x: offsetX, y: offsetY };
            }

            this.center = { x: e.clientX, y: e.clientY };
            */
        })

        // this.stage.setInteractive();
        // this.stage.on('pointerdown', this.drawStart, this);
        // this.stage.on('pointermove', this.drawUpdate, this);
        // this.stage.on('pointerup', this.drawStop, this);

        listener.on("scale", (num: number) => {
            this.onScale(this.stageScale * num);
            /*
            var oldX = this.container.scale * this.stageWidth;
            var oldY = this.container.scale * this.stageHeight;
            this.container.scale = this.stageScale * num;
            var newX = this.container.scale * this.stageWidth;
            var newY = this.container.scale * this.stageHeight;
            // this.container.x -= (newX - oldX) / 2;
            // this.container.y -= (newY - oldY) / 2;
            var offsetX = this.centerX / this.stageWidth;
            var offsetY = this.centerY / this.stageHeight;
            console.log(offsetX, offsetY);
            this.container.x -= (newX - oldX) * offsetX;
            this.container.y -= (newY - oldY) * offsetY;
            */
        })

        listener.on("center", (x: number, y: number) => {
            // worldToContainer(x, y)
            // this.updateDrawView(x, y);
            var p = this.worldToContainer(x, y);
            this.centerX = p.x;
            this.centerY = p.y;
        })

        listener.on("tap", (x: number, y: number) => {
            // console.log("tap")
            this.updateDrawView(x, y);
            this.penView.show();
            this.penView.x = x;
            this.penView.y = y;
        })

        listener.on("move", (x: number, y: number, total: number, point: any) => {
            if (total > 1) {
                this.container.x = this.stageX + x;
                this.container.y = this.stageY + y;
                // this.cameras.main.x = x;
                // this.cameras.main.y = y;

                // var camera = this.cameras.main;
                // this.cameras.main.pan(-x, -y, 100);
                // camera.centerOn(camera.centerX - x, camera.centerY - y);

                // this.cameras.main.centerOn(x, y);

                this.penView.hide();
            }
            else{
                this.penView.show();
            }
            this.penView.x = point.x;
            this.penView.y = point.y;

        })

        listener.on("end", () => {
            // this.stageScale = this.container.scale;
            this.stageX = this.container.x;
            this.stageY = this.container.y;
            this.penView.hide();
        })

        listener.on("select", (x: number, y: number) => {
            this.updateDrawView(x, y);
        })

        listener.on("change_type", (type: number) => {
            // console.log('change_type', type);
            this.clickType = type;
        });

        listener.on("test", () => {
            var start: Point = this.mapView.mapData.find(MapData.TYPE_PLAYER);
            var end: Point = this.mapView.mapData.find(MapData.TYPE_AIM);
            var list = this.shortPath.find(start, end);
            list.forEach(item => {
                item.type = MapData.TYPE_PLAYER;
            })
            this.mapView.update();
            console.log(list);
        });

        listener.on("reset", () => {
            this.clickType = MapData.TYPE_FREE;
            this.container.x = 0;
            this.container.y = 0;
            this.container.scale = 1;
            this.mapView.reset();
        });

    }

    drawStart(pointer: any) {
        this.drawing = true;
        this.updateDrawView(pointer.downX, pointer.downY);
    }

    drawUpdate(pointer: any) {
        if (this.drawing) {
            this.updateDrawView(pointer.worldX, pointer.worldY);
        }
    }

    drawStop(pointer: any) {
        this.drawing = false;
        console.log(pointer, "drawStop");
    }

    updateDrawView(x: number, y: number) {
        var p = this.worldToContainer(x, y)
        var col = Math.floor(p.x / this.size);
        var row = Math.floor(p.y / this.size);
        this.mapView.changeType(row, col, this.clickType);
    }

    worldToContainer(x: number, y: number) {
        return {
            x: (x - this.container.x) / this.container.scale,
            y: (y - this.container.y) / this.container.scale
        }
    }

    update(time: any): void {

    }
}