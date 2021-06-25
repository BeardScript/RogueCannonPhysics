import * as RE from 'rogue-engine';
import { Vector3, Object3D } from 'three';
import * as CANNON from 'cannon-es';
import CannonConstraint from './CannonConstraint';

const { Prop } = RE;

export default class CannonHingeConstraint extends CannonConstraint {
  constraint: CANNON.HingeConstraint;

  @Prop("Object3D") target: Object3D;
  @Prop("Vector3") pivotA: Vector3 = new Vector3(0.1, 0, 0);
  @Prop("Vector3") axisA: Vector3 = new Vector3(0, 1, 0);
  @Prop("Vector3") pivotB: Vector3 = new Vector3(-1, 0, 0);
  @Prop("Vector3") axisB: Vector3 = new Vector3(0, 1, 0);
  @Prop("Boolean") collideConnected: boolean;
  @Prop("Number") maxForce: number = 1e6;

  protected createConstraint() {
    if (!this.target) throw "CannonHinge requires a target";

    const bodyA = this.getCannonBodyComponent(this.object3d).body;
    const bodyB = this.getCannonBodyComponent(this.target).body;

    this.constraint = new CANNON.HingeConstraint(bodyA, bodyB, {
      pivotA: new CANNON.Vec3(this.pivotA.x, this.pivotA.y, this.pivotA.z),
      axisA: new CANNON.Vec3(this.axisA.x, this.axisA.y, this.axisA.z),
      pivotB: new CANNON.Vec3(this.pivotB.x, this.pivotB.y, this.pivotB.z),
      axisB: new CANNON.Vec3(this.axisB.x, this.axisB.y, this.axisB.z),
      collideConnected: this.collideConnected,
      maxForce: this.maxForce,
    });

    this.cannonConfig.world.addConstraint(this.constraint);
  }
}

RE.registerComponent(CannonHingeConstraint);
