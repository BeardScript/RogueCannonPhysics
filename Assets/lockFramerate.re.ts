import * as RE from 'rogue-engine';

export default class lockFramerate extends RE.Component {
  time = 0;
  lastTime = 0;

  deltaTime = 0;

  done = false;

  start() {
    // RE.Runtime.renderer.setAnimationLoop = function(callback) {
    //   const animate = () => {
    //     // setTimeout( function() {
    //       requestAnimationFrame( animate );
    //     // }, 1000 / 30 );

    //     callback && callback();
    //     console.log(RE.Runtime.deltaTime);
    //   }
    // }

    // RE.Runtime.renderer.setAnimationLoop(RE.Runtime["beginUpdateCycle"]);

    // RE.Runtime.renderer.setAnimationLoop = () => {};

    // const update = RE.Runtime["beginUpdateCycle"];

    // const animate = () => {
    //   setTimeout( () => {
    //     // requestAnimationFrame(animate);
    //   }, 1000 / 30 );

    //   RE.Runtime["beginUpdateCycle"].bind(RE.Runtime)();
    //   // console.log(RE.Runtime.deltaTime);
    // }

    // animate();
  }

  beforeUpdate() {
    if (!this.done) {
      RE.Runtime.renderer.setAnimationLoop(null);
      this.done = true;
      const animate = () => {
        setTimeout( () => {
          requestAnimationFrame(animate);
        }, 1000 / 30 );
  
        RE.Runtime["beginUpdateCycle"]();
        // console.log(RE.Runtime.deltaTime);
      }
  
      animate();
    }
  }

  update() {
    // this.time = performance.now() / 1000;
    // this.deltaTime = this.time - this.lastTime;

    // console.log("Delta: ",this.deltaTime);
    // console.log(RE.Runtime.deltaTime);

    // this.lastTime = this.time;
  }
}

RE.registerComponent(lockFramerate);
