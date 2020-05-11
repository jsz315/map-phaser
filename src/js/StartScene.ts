import * as Phaser from 'phaser';
import listener from "./listener.js";
import {ViewFactory} from './ViewFactory'
import Tooler from './tooler';

export class StartScene extends Phaser.Scene {
  stage: Phaser.GameObjects.Polygon;
  stageWidth: number;
  stageHeight: number;
  stageColor: number = 0xffffff;
  stageScale: number = 1;
  stageX: number = 0;
  stageY: number = 0;
  container: Phaser.GameObjects.Container;
  curView: any;
  sx:number = 0;
  sy:number = 0;
  hole: Phaser.GameObjects.Graphics;
  drawing:boolean = false;
  rects: any[] = [];

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
    this.container = this.add.container(0, 0);
    this.hole = this.add.graphics();

    this.stageWidth = Number(this.game.config.width);
    this.stageHeight = Number(this.game.config.height);
    
    this.resetStage();
    this.addEvent();
    this.addPolygons();

    setTimeout(() => {

    }, 3000);
  }

  addPolygons(){
    this.rects = [];
    var w = 20;
    var h = 20;
    var col = Math.ceil(this.stageWidth / w);
    var row = Math.ceil(this.stageHeight / h);
    for(var i = 0; i < row; i++){
      this.rects[i] = [];
      for(var j = 0; j < col; j++){
        // var color = Math.floor(Math.random() * 0xffffff);
        var color = 0x999999;
        var rect = ViewFactory.makeRect(this, color, w, h);
        this.container.add(rect);
        rect.x = j * w;
        rect.y = i * h;
        this.rects[i][j] = rect;
      }

    }
  }

  resetStage(){
    if(this.stage){
      this.stage.destroy(true);
    }
    this.stage = ViewFactory.makeRect(this, this.stageColor, this.stageWidth, this.stageHeight);
    this.container.addAt(this.stage, 0);
    this.container.width = this.stageWidth;
    this.container.height = this.stageHeight;
    this.resetHole();
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

      this.container.x -= (newX - oldX) / 2;
      this.container.y -= (newY - oldY) / 2;
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
      this.container.x -= (newX - oldX) / 2;
      this.container.y -= (newY - oldY) / 2;
    })

    listener.on("center", (x:number, y:number)=>{
      // worldToContainer(x, y)
      this.updateDrawView(x, y);
    })

    listener.on("tap", (x:number,y:number)=>{
      this.updateDrawView(x, y);
    })

    listener.on("move", (x:number, y:number)=>{
      this.container.x = this.stageX + x;
      this.container.y = this.stageY + y;
    })

    listener.on("end", ()=>{
      this.stageScale = this.container.scale;
      this.stageX = this.container.x;
      this.stageY = this.container.y;
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
    // x = (x - this.container.x) / this.container.scale;
    // y = (y - this.container.y) / this.container.scale;
    var p = this.worldToContainer(x, y)
    var col = Math.floor(p.x / 20);
    var row = Math.floor(p.y / 20);
    if(this.rects[row] && this.rects[row][col]){
      this.rects[row][col].fillColor = 0xffffff;
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