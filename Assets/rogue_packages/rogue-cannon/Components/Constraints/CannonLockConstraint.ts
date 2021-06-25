import * as RE from 'rogue-engine';
import { Object3D } from 'three';
import * as CANNON from 'cannon-es';
import CannonConstraint from './CannonConstraint';

const { Prop } = RE;

export default class CannonLockConstraint extends CannonConstraint {
  constraint: CANNON.LockConstraint;

  @Prop("Object3D") target: Object3D;
  @Prop("Number") maxForce: number = 1e6;

  protected createConstraint() {
    if (!this.target) throw "CannonHinge requires a target";

    const bodyA = this.getCannonBodyComponent(this.object3d).body;
    const bodyB = this.getCannonBodyComponent(this.target).body;

    this.constraint = new CANNON.LockConstraint(bodyA, bodyB, {
      maxForce: this.maxForce
    });

    this.cannonConfig.world.addConstraint(this.constraint);
  }
}

RE.registerComponent(CannonLockConstraint);
