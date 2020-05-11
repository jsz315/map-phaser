<template>
  <div class="stage">
      <canvas class="canvas" ref="canvas"></canvas>
      <File ref="file"/>
      <Setting ref="setting"/>
      <div class="debug">
        <div class="tip">type: {{type}}</div>
        <div class="tip">scale: {{scale}}</div>
        <div class="tip">rotation: {{rotation}}</div>
        <div class="tip">x: {{x}}</div>
        <div class="tip">y: {{y}}</div>
        <div class="tip">clientX: {{clientX}}</div>
        <div class="tip">clientY: {{clientY}}</div>
      </div>
  </div>
</template>

<script>

// import Hammer from 'hammerjs';
import game from '../../js/App.ts'
import listener from '../../js/listener'
import touch from '../../js/touch'
import File from '../file/index.vue'
import Setting from '../setting/index.vue'



export default {
  name: 'stage',
  data(){
    return {
      rotation: 0,
      scale: 0,
      type: '',
      x: 0,
      y: 0,
      clientX: 0,
      clientY: 0
    }
  },
  props: {
    msg: String
  },
  components: {
    File, Setting
  },
  mounted(){
    var canvas = this.$refs.canvas;
    game.init(canvas);
    this.useMine(canvas);
  },
  methods: {
    useMine(canvas){
      var vm = this;
      touch.init({
        dom: canvas,
        onScale: (num)=>{
          vm.scale = num;
          listener.emit("scale", num);
        },
        onCenter: (x, y)=>{
          listener.emit("center", x / window.innerWidth * 750, y / window.innerWidth * 750);
        },
        onMove: (x, y)=>{
          vm.x = x;
          vm.y = y;
          listener.emit("move", x, y);
        },
        onEnd: ()=>{
          listener.emit("end");
        },
        onTap: (x, y)=>{
          vm.clientX = x;
          vm.clientY = y;
          listener.emit("tap", x / window.innerWidth * 750, y / window.innerWidth * 750);
        }
      });
    },
    useHammer(canvas){
      // var vm = this;

      // var mc = new Hammer.Manager(canvas);
      // mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
      // mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
      // mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
      // mc.add(new Hammer.Tap());

      // mc.on("panstart panmove", onPan);
      // mc.on("rotatestart rotatemove", onRotate);
      // mc.on("pinchstart pinchmove", onPinch);
      // mc.on("tap", onTap);

      // mc.on("hammer.input", function(ev) {
      //     if(ev.isFirst){
      //         console.log('开始');
      //         console.log(ev);
      //         vm.type = '开始';
      //         let p = ev.changedPointers[0];
      //     }
      //     if(ev.isFinal) {
      //         console.log('结束');
      //         vm.type = '结束';

      //         listener.emit("end");
      //     }
      // });
  
      // function onPan(ev) {
      //     console.log('onPan');
      //     console.log(ev);
      //     vm.type = 'onPan';
      //     vm.x = ev.deltaX;
      //     vm.y = ev.deltaY;
      // }

      // function onPinch(ev) {
      //     console.log('onPinch');
      //     console.log(ev);
      //     console.log(ev.scale);
      //     vm.scale = ev.scale;
      //     listener.emit("scale", ev.scale, vm.x, vm.y);
      // }

      // function onRotate(ev) {
      //     console.log('onRotate');
      //     console.log(ev);
      //     vm.rotation = ev.rotation;
      //     vm.type = 'onRotate';
      // }

      // function onTap(ev) {
      //     console.log('onTap');
      //     console.log(ev);
      //     vm.type = 'onTap';
      // }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>

