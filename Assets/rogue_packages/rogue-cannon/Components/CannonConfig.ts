import * as RE from 'rogue-engine';
import * as CANNON from 'cannon-es';
import { Vector3 } from 'three';

const { Prop } = RE;

export default class CannonConfig extends RE.Component {
  world: CANNON.World;

  @Prop("Number") step: number = 1/60;
  @Prop("Vector3") gravity: Vector3 = new Vector3(0, -9.82, 0);

  awake() {
    this.world = new CANNON.World();
    this.world.gravity.set(this.gravity.x, this.gravity.y, this.gravity.z);
    this.world.broadphase = new CANNON.NaiveBroadphase();
  }

  beforeUpdate() {
    this.world.gravity.set(this.gravity.x, this.gravity.y, this.gravity.z);
    this.world.step(this.step, RE.Runtime.deltaTime, 1);
  }
}

RE.registerComponent( CannonConfig );
