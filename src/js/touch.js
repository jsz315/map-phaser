import listener from './listener'

function init(param){

    var dom = param.dom;
    var onScale = param.onScale || function(n){};
    var onCenter = param.onCenter || function(x, y){};
    var onMove = param.onMove || function(x, y, total){};
    var onEnd = param.onEnd || function(){};
    var onTap = param.onTap || function(x, y){};
    var onSelect = param.onSelect || function(x, y){};
    var isMobile = checkMobile();

    var moving = false;
    var startPoint = {x: 0, y: 0};
    var startDistance = 0;

    dom.addEventListener("touchstart", (e)=>{
        moving = true;
        var ts = e.targetTouches;
        console.log(e);
        e.preventDefault();
        
        if(ts.length == 1){
            startPoint = toPoint(ts[0]);
            onTap(startPoint.x, startPoint.y);
        }
        else if(ts.length == 2){
            startPoint = getCenter(ts[0], ts[1]);
            startDistance = getDistance(ts[0], ts[1]);
            onCenter(startPoint.x, startPoint.y);
        }

        var moveEvent = listener.make(dom, 'touchmove', onTouchMove);
        var endEvent = listener.make(window, 'touchend', ()=>{
            moving = false;
            startDistance = 0;
            moveEvent.destroy();
            endEvent.destroy();
            onEnd();
        });

    })

    function onTouchMove(e){
        if(!moving){
            return;
        }
        e.preventDefault();

        var ts = e.targetTouches;
        var endPoint;
        if(ts.length == 1){
            endPoint = toPoint(ts[0]);
            // endPoint && onMove(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
            onSelect(endPoint.x, endPoint.y);
        }
        else if(ts.length == 2){
            endPoint = getCenter(ts[0], ts[1]);
            var endDistance = getDistance(ts[0], ts[1]);
            startDistance && onScale(endDistance / startDistance);
            // endPoint && onMove(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        }
        endPoint && onMove(endPoint.x - startPoint.x, endPoint.y - startPoint.y, ts.length);
    }
}

function toPoint(t){
    return {
        x: t.clientX,
        y: t.clientY
    }
}

function getCenter(a, b){
    a = toPoint(a);
    b = toPoint(b);
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
    }
}

function getDistance(a, b){
    a = toPoint(a);
    b = toPoint(b);
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function checkMobile(){
    let list = ["Android", "iPhone", "iPad"];
    let res = list.find(item => {
        if(navigator.userAgent.indexOf(item) != -1){
            return true;
        }
    })
    return !!res;
}



export default {
    init
}