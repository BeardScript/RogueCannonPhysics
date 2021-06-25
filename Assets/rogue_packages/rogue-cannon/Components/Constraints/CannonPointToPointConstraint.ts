import * as RE from 'rogue-engine';
import { Vector3, Object3D } from 'three';
import * as CANNON from 'cannon-es';
import CannonConstraint from './CannonConstraint';

const { Prop } = RE;

export default class CannonPointToPointConstraint extends CannonConstraint {
  constraint: CANNON.PointToPointConstraint;

  @Prop("Object3D") target: Object3D;
  @Prop("Vector3") privotA: Vector3 = new Vector3();
  @Prop("Vector3") privotB: Vector3 = new Vector3();
  @Prop("Number") maxForce: number = 1e6;

  protected createConstraint() {
    if (!this.target) throw "CannonHinge requires a target";

    const bodyA = this.getCannonBodyComponent(this.object3d).body;
    const bodyB = this.getCannonBodyComponent(this.target).body;

    this.constraint = new CANNON.PointToPointConstraint(
      bodyA,
      new CANNON.Vec3(this.privotA.x, this.privotA.y, this.privotA.z),
      bodyB,
      new CANNON.Vec3(this.privotB.x, this.privotB.y, this.privotB.z),
      this.maxForce
    );

    this.cannonConfig.world.addConstraint(this.constraint);
  }
}

RE.registerComponent(CannonPointToPointConstraint);
