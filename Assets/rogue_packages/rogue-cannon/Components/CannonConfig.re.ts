import * as RE from 'rogue-engine';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { CannonPhysics } from '../Lib/CannonPhysics';

export default class CannonConfig extends RE.Component {
  private _defaultFriction = 0.01;
  private _defaultRestitution = 0;

  @RE.Prop("Number") step: number = 1/60;

  @RE.Prop("Number") 
  get defaultFriction() {
    return this._defaultFriction;
  }

  set defaultFriction(value: number) {
    this._defaultFriction = value;
  }

  @RE.Prop("Number") 
  get defaultRestitution() {
    return this._defaultRestitution;
  }

  set defaultRestitution(value: number) {
    this._defaultRestitution = value;
  }

  @RE.Prop("Vector3") gravity: THREE.Vector3 = new THREE.Vector3(0, -9.82, 0);

  awake() {
    CannonPhysics.world = new CANNON.World();
    CannonPhysics.world.gravity.set(this.gravity.x, this.gravity.y, this.gravity.z);
    CannonPhysics.world.broadphase = new CANNON.NaiveBroadphase();
    CannonPhysics.world.defaultContactMaterial.friction = this.defaultFriction;
    CannonPhysics.world.defaultContactMaterial.restitution = this.defaultRestitution;
  }

  afterUpdate() {
    // CannonPhysics.world.gravity.set(this.gravity.x, this.gravity.y, this.gravity.z);
    CannonPhysics.world.step(this.step, RE.Runtime.deltaTime, 1);
  }
}

RE.registerComponent( CannonConfig );
