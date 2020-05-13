export class Point{
  
  x:number;
  y:number;
  
  parent:Point;

  toStart:number = 0;//到起点的代价
  toEnd:number = 0;//到终点的代价
  cost:number = 0;//估值

  type:number = 1;
  
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }

}