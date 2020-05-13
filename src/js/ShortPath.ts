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
    var over:boolean = false;

    while(this.openList.length && !over){
      var curPoint:Point = this.popMinCostPoint(start, end);
      over = ShortPath.checkSame(curPoint, end) || curPoint == null;
      if(!over){
        var aroundList = this.getAroundPoint(start);
        aroundList.forEach((point:Point) => {
          var {x, y} = point;
          if(this.mapData.points[x][y].type != MapData.TYPE_BLOCK && !this.checkContain(this.closeList, point)){
            if(!this.checkContain(this.openList, point)){
              this.openList.push(point);
              ShortPath.calculateCost(start, end, point);
              point.parent = curPoint;
            }
            else{
              ShortPath.updateCost(point);
              if(point.cost < curPoint.cost){
                point.parent = curPoint;
              }
            }
          }
        })
        this.closeList.push(curPoint);
      }
    }
    return this.closeList;
  }

  checkContain(list:Array<Point>, point:Point):boolean{
    for(var i = 0; i < list.length; i++){
      if(list[i].x == point.x && list[i].y == point.y){
        return true;
      }
    }
    return false;
  }

  getAroundPoint(p:Point):Array<Point>{
    var points = [];
    var {x, y} = p;
    for(var i = -1; i <= 1; i++){
      for(var j = -1; j <= 1; j++){
        var isSelf = i == 0 && j == 0;
        var isCorner = i == j || i == -j;
        if(!isSelf && !isCorner){
          points.push(new Point(x + i, y + j));
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
      if(point.cost == 0){
        ShortPath.calculateCost(start, end, point);
      }
      if(point.cost < min){
        aim = point;
        id = index
      } 
    })

    this.openList.splice(id, 1);
    return aim;
  }

  static checkSame(a:Point, b:Point):boolean{
    return (a.x == b.x) && (a.y == b.y);
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
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
}