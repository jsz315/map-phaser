import {Point} from './Point'
import { MapData } from './MapData';

export class Path{

  mapData:MapData;
  openList:Array<Point>;
  closeList:Array<Point>;
  resultList:Array<Point>;

  constructor(mapData:MapData){
    this.mapData = mapData;
  }
  
  find(start:Point, end:Point):Array<Point>{
    var path:Array<Point> = [];
    
    return path;
  }

  getAroundPoint(p:Point){
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

  static getDistance(a:Point, b:Point):number{
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
}