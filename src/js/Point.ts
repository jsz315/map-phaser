export class Point{

  x:number;
  y:number;
  cost:number;
  parent:Point;
  
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}