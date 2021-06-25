import * as RE from 'rogue-engine';
import CannonConfig from '../CannonConfig';
import { Object3D } from 'three';
import * as CANNON from 'cannon-es';
import CannonBody from '../Shapes/CannonBody';

export default class CannonConstraint extends RE.Component {
  cannonConfig: CannonConfig;
  constraint: CANNON.Constraint;
  targetBody: CANNON.Body;

  awake() {
    this.setCannonConfig();
  }

  start() {
    this.createConstraint();
  }

  private setCannonConfig() {
    const config = RE.App.currentScene.getObjectByName("Config");

    if (config) {
      this.cannonConfig = RE.getComponent(CannonConfig, config) as CannonConfig;
    }
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
    this.cannonConfig.world.removeConstraint(this.constraint);
  }
}
