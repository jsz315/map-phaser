import { Point } from './Point'
import { MapData } from './MapData';

export class ShortPath {

    mapData: MapData;
    openList: Array<Point>;
    closeList: Array<Point>;

    constructor(mapData: MapData) {
        this.mapData = mapData;
    }

    find(start: Point, end: Point): Array<Point> {
        console.log("start");
        this.openList = [];
        this.closeList = [];
        this.openList.push(start);
        ShortPath.calculateCost(start, end, start);
        var running: boolean = true;
        var timer: number = Date.now();
        while (running) {
            var curPoint: Point = this.popMinCostPoint(start, end);
            if (curPoint == null) {
                console.log("查找完毕");
                running = false;
            }
            else {
                if (ShortPath.checkSame(curPoint, end)) {
                    console.log("查找成功");
                    running = false;
                }
                if (!ShortPath.checkContain(this.closeList, curPoint)) {
                    this.closeList.push(curPoint);
                }
            }
            if (running) {
                var aroundList = this.getAroundPoint(curPoint);
                console.log(aroundList.length, "total");
                aroundList.forEach((point: Point) => {
                    if (!ShortPath.checkContain(this.closeList, point)) {
                        if (ShortPath.checkContain(this.openList, point)) {
                            // var oldStart = point.toStart;
                            // var newStart = curPoint.toStart + ShortPath.getDistance(point, curPoint);
                            // if (newStart < oldStart) {
                            //     point.toStart = newStart;
                            //     point.cost = point.toStart + point.toEnd;
                            //     point.parent = curPoint;
                            // }
                        }
                        else {
                            this.openList.push(point);
                            ShortPath.calculateCost(curPoint, end, point);
                            point.parent = curPoint;
                        }
                    }
                })
            }
        }
        var aim = [end];
        var node = aim[0];
        while (node.parent) {
            aim.push(node.parent);
            node = node.parent
        }
        aim.reverse();
        if (aim[0] == start) {
            console.log("查找成功, 耗时：", Date.now() - timer);
        }
        else {
            console.log("查找失败, 耗时：", Date.now() - timer);
        }
        return aim;
    }

    static checkContain(list: Array<Point>, point: Point): boolean {
        for (var i = 0; i < list.length; i++) {
            if (ShortPath.checkSame(list[i], point)) {
                return true;
            }
        }
        return false;
    }

    getAroundPoint(p: Point): Array<Point> {
        var points = [];
        var { row, col } = p;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                var isSelf = i == 0 && j == 0;
                var isCorner = i == j || i == -j;
                if (!isSelf && !isCorner) {
                    var ps = this.mapData.points;
                    if (ps[row + i] && ps[row + i][col + j]) {
                        if (ps[row + i][col + j].type != MapData.TYPE_BLOCK) {
                            points.push(ps[row + i][col + j]);
                        }
                    }
                }
            }
        }
        return points;
    }

    popMinCostPoint(start: Point, end: Point): Point {
        var aim: any;
        var min = Infinity;
        var id: number = 0;
        this.openList.forEach((point: Point, index: number) => {
            //   ShortPath.calculateCost(start, end, point);
            if (point.cost < min) {
                aim = point;
                id = index;
            }
        })

        this.openList.splice(id, 1);
        console.log(`id = ${id} 最小代价${aim.cost} (${aim.row}, ${aim.col})`);
        return aim;
    }

    static checkSame(a: Point, b: Point): boolean {
        return (a.row == b.row) && (a.col == b.col);
    }

    static calculateCost(start: Point, end: Point, point: Point) {
        // point.toStart = ShortPath.getDistance(start, point);
        point.toStart = start.toStart + ShortPath.getDistance(point, start);
        point.toEnd = ShortPath.getDistance(end, point);
        point.cost = point.toStart + point.toEnd;
    }

    static getDistance(a: Point, b: Point): number {
        // return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }
}