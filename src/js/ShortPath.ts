import {Point} from './Point'
import { MapData } from './MapData';

export class ShortPath{

  mapData:MapData;
  openList:Array<Point>;
  closeList:Array<Point>;
  resultList:Array<Point>;

  constructor(mapData:MapData){
    this.mapData = mapData;
  }
  
  find(start:Point, end:Point):Array<Point>{

    this.openList= [];
    this.closeList = [];
    this.openList.push(start);
    var running:boolean = true;
    var timer:number = 0;
    while(running){
      console.log("timer", ++timer);
      var curPoint:Point = this.popMinCostPoint(start, end);
      if(curPoint == null){
        console.log("查找完毕");
        running = false;
      }
      else{
        if(ShortPath.checkSame(curPoint, end)){
          console.log("成功找到");
          running = false;
        }
        if(!ShortPath.checkContain(this.closeList, curPoint)){
          this.closeList.push(curPoint);
        }
      }
      if(running){
        var aroundList = this.getAroundPoint(start);
        console.log(aroundList.length, "total");
        aroundList.forEach((point:Point) => {
          if(!ShortPath.checkContain(this.closeList, point)){
            if(ShortPath.checkContain(this.openList, point)){
              ShortPath.updateCost(point);
              if(point.cost < curPoint.cost){
                point.parent = curPoint;
              }
            }
            else{
              this.openList.push(point);
              ShortPath.calculateCost(start, end, point);
              point.parent = curPoint;
            }
          }
        })
      }
    }
    return this.closeList;
  }

  static checkContain(list:Array<Point>, point:Point):boolean{
    for(var i = 0; i < list.length; i++){
      if(ShortPath.checkSame(list[i], point)){
        return true;
      }
    }
    return false;
  }

  getAroundPoint(p:Point):Array<Point>{
    var points = [];
    var {row, col} = p;
    for(var i = -1; i <= 1; i++){
      for(var j = -1; j <= 1; j++){
        var isSelf = i == 0 && j == 0;
        var isCorner = i == j || i == -j;
        if(!isSelf && !isCorner){
          var ps = this.mapData.points;
          if(ps[row + i] && ps[row + i][col + j]){
            if(ps[row + i][col + j].type != MapData.TYPE_BLOCK){
              points.push(ps[row + i][col + j]);
            }
          }
        }
      }
    }
    return points;
  }

  popMinCostPoint(start:Point, end:Point):Point{
    var aim:any;
    var min = Infinity;
    var id:number = 0;
    this.openList.forEach((point:Point, index:number) => {
      // if(point.cost == 0){
      //   ShortPath.calculateCost(start, end, point);
      // }
      ShortPath.calculateCost(start, end, point);
      if(point.cost < min){
        aim = point;
        id = index;
      } 
    })

    this.openList.splice(id, 1);
    return aim;
  }

  static checkSame(a:Point, b:Point):boolean{
    return (a.row == b.row) && (a.col == b.col);
  }

  static calculateCost(start:Point, end:Point, point:Point){
    point.toStart = ShortPath.getDistance(start, point);
    point.toEnd = ShortPath.getDistance(end, point);
    point.cost = point.toStart + point.toEnd;
  }

  static updateCost(point:Point){
    point.cost = point.toEnd + point.parent.toStart;
  }

  static getDistance(a:Point, b:Point):number{
    return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
  }
}