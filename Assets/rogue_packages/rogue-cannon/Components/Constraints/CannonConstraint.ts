import * as RE from 'rogue-engine';
import { Object3D } from 'three';
import * as CANNON from 'cannon-es';
import CannonBody from '../CannonBody.re';
import { CannonPhysics } from '../../Lib/CannonPhysics';

export default class CannonConstraint extends RE.Component {
  constraint: CANNON.Constraint;
  targetBody: CANNON.Body;

  start() {
    this.createConstraint();
  }

  protected getCannonBodyComponent(object3d: Object3D): CannonBody {
    const cannonBody = RE.getComponent(CannonBody, object3d);

    if (!cannonBody) {
      throw "CannonHinge targets must have a Cannon Body Component"
    }

    return cannonBody;
  }

  protected createConstraint() {}

  onRemoved() {
    CannonPhysics.world.removeConstraint(this.constraint);
  }
}
