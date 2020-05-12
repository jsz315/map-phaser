import * as Phaser from 'phaser';
import listener from "./listener.js";
import {ViewFactory} from './ViewFactory'
import Tooler from './tooler';
import {MapView} from './MapView';

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
  sx:number = 0;
  sy:number = 0;
  hole: Phaser.GameObjects.Graphics;
  drawing:boolean = false;
  rects: any[] = [];
  center:any = {};
  offset:any = {};
  size:number = 80;
  mapView: MapView;

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
  }

  create(): void {
    this.stageWidth = Number(this.game.config.width);
    this.stageHeight = Number(this.game.config.height);
    this.container = this.add.container(0, 0);

    this.mapView = new MapView(this, this.stageWidth, this.stageHeight, this.size);
    this.container.add(this.mapView);
    this.hole = this.add.graphics();

    // this.container.width = this.stageWidth;
    // this.container.height = this.stageHeight;
    this.resetHole();
    this.addEvent();
  }

  addEvent(){
    window.addEventListener("mousewheel", (e:any) => {
      var oldX = this.container.scale * this.stageWidth;
      var oldY = this.container.scale * this.stageHeight;
      if(e.deltaY > 0){
        this.container.scale *= 0.9;
      }
      else{
        this.container.scale *= 1.1;
      }
      var newX = this.container.scale * this.stageWidth;
      var newY = this.container.scale * this.stageHeight;


      if(e.clientX == this.center.x && e.clientY == this.center.y){
        this.container.x -= (newX - oldX) * this.offset.x;
        this.container.y -= (newY - oldY) * this.offset.y;
      }
      else{
        console.log(this.game.canvas.offsetLeft, this.game.canvas.offsetTop, "offset")
        var sx = e.clientX - this.game.canvas.offsetLeft;
        var sy = e.clientY - this.game.canvas.offsetTop;
        var center = this.worldToContainer(sx, sy);
  
        var offsetX = center.x / this.stageWidth;
        var offsetY = center.y / this.stageHeight;
        console.log(offsetX, offsetY);
        this.container.x -= (newX - oldX) * offsetX;
        this.container.y -= (newY - oldY) * offsetY;
        this.offset = {x: offsetX, y: offsetY};
      }

      this.center = {x: e.clientX, y: e.clientY};
    })

    // this.stage.setInteractive();
    // this.stage.on('pointerdown', this.drawStart, this);
    // this.stage.on('pointermove', this.drawUpdate, this);
    // this.stage.on('pointerup', this.drawStop, this);

    listener.on("scale", (num:number)=>{
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
    })

    listener.on("center", (x:number, y:number)=>{
      // worldToContainer(x, y)
      this.updateDrawView(x, y);
      var p = this.worldToContainer(x, y);
      this.centerX = p.x;
      this.centerY = p.y;
    })

    listener.on("tap", (x:number,y:number)=>{
      this.updateDrawView(x, y);
      // var p = this.worldToContainer(x, y);
      // this.centerX = p.x;
      // this.centerY = p.y;
    })

    listener.on("move", (x:number, y:number, total:number)=>{
      if(total > 1){
        this.container.x = this.stageX + x;
        this.container.y = this.stageY + y;
      }
    })

    listener.on("end", ()=>{
      this.stageScale = this.container.scale;
      this.stageX = this.container.x;
      this.stageY = this.container.y;
    })

    listener.on("select", (x:number,y:number)=>{
      this.updateDrawView(x, y);
      // var p = this.worldToContainer(x, y);
    })
  }

  drawStart(pointer:any){
    this.drawing = true;
    // console.log(pointer.downX, pointer.downY, "drawStart");
    this.updateDrawView(pointer.downX, pointer.downY);
  }

  drawUpdate(pointer:any){
    if(this.drawing){
      // console.log(pointer.worldX, pointer.worldY, "drawUpdate");
      this.updateDrawView(pointer.worldX, pointer.worldY);
    }
  }

  drawStop(pointer:any){
    this.drawing = false;
    console.log(pointer, "drawStop");
  }

  updateDrawView(x:number, y:number){
    var p = this.worldToContainer(x, y)
    var col = Math.floor(p.x / this.size);
    var row = Math.floor(p.y / this.size);
    // if(this.rects[row] && this.rects[row][col]){
    //   this.toggleColor(this.rects[row][col]);
    // }
    this.mapView.setFree(row, col);
  }

  toggleColor(view: any){
    if(view){
      // if(view.fillColor == 0xffffff){
      //   view.fillColor = 0x000000;
      // }
      // else{
      //   view.fillColor = 0xffffff;
      // }
      view.fillColor = 0xffffff;
    }
  }

  worldToContainer(x:number, y:number){
    return {
      x: (x - this.container.x) / this.container.scale,
      y: (y - this.container.y) / this.container.scale
    }
  }

  resetHole(){
    var {x, y, scale} = this.container;
    this.hole.clear();
    this.hole.fillStyle(0x020202, 0.8)
    this.hole.beginPath();

    this.hole.moveTo(0, 0);
    this.hole.lineTo(0, this.stageHeight);
    this.hole.lineTo(this.stageWidth, this.stageHeight);
    this.hole.lineTo(this.stageWidth, 0);
    this.hole.closePath();

    this.hole.moveTo(x, y);
    this.hole.lineTo(x + this.stageWidth * scale, y);
    this.hole.lineTo(x + this.stageWidth * scale, y + this.stageHeight * scale);
    this.hole.lineTo(x, y + this.stageHeight * scale);
    this.hole.closePath();

    this.hole.fill();
  }

  update(time: any): void {
    this.resetHole();
  }
}