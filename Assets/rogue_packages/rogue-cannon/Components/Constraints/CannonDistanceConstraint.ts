import * as RE from 'rogue-engine';
import { Object3D } from 'three';
import * as CANNON from 'cannon-es';
import CannonConstraint from './CannonConstraint';

const { Prop } = RE;

export default class CannonDistanceConstraint extends CannonConstraint {
  constraint: CANNON.DistanceConstraint;

  @Prop("Object3D") target: Object3D;
  @Prop("Number") distance: number = 1;
  @Prop("Number") maxForce: number = 1e6;

  protected createConstraint() {
    if (!this.target) throw "CannonHinge requires a target";

    const bodyA = this.getCannonBodyComponent(this.object3d).body;
    const bodyB = this.getCannonBodyComponent(this.target).body;

    this.constraint = new CANNON.DistanceConstraint(bodyA, bodyB, this.distance, this.maxForce);

    this.cannonConfig.world.addConstraint(this.constraint);
  }
}

RE.registerComponent(CannonDistanceConstraint);
