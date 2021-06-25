import * as RE from 'rogue-engine';
import CannonConfig from '../CannonConfig';
import { Vector3, Quaternion } from 'three';
import * as CANNON from 'cannon-es';

export default class CannonBody extends RE.Component {
  cannonConfig: CannonConfig;
  shape: CANNON.Shape;
  body: CANNON.Body;
  angularDamping = 0;
  linearDamping = 0;
  mass = 1;

  awake() {
    this.setCannonConfig();
    this.createShape();
    this.createBody();
  }

  start() {
    this.cannonConfig.world.addBody(this.body);
  }

  update() {
    this.updatePhysics();
  }

  onBeforeRemoved() {
    this.cannonConfig.world.removeBody(this.body);
  }

  private setCannonConfig() {
    const config = RE.App.currentScene.getObjectByName("Config");

    if (config) {
      this.cannonConfig = RE.getComponent(CannonConfig, config) as CannonConfig;
    }
  }

  private createBody() {
    this.body = new CANNON.Body({
      angularDamping: this.angularDamping,
      linearDamping: this.linearDamping,
      mass: this.mass
    });

    this.body.addShape(this.shape);
    this.copyObjectTransform();
  }

  protected createShape(): void {};

  protected copyObjectTransform() {
    const newPos = new CANNON.Vec3(
      this.object3d.position.x,
      this.object3d.position.y,
      this.object3d.position.z
    );

    const newQuaternion = new CANNON.Quaternion(
      this.object3d.quaternion.x,
      this.object3d.quaternion.y,
      this.object3d.quaternion.z,
      this.object3d.quaternion.w
    );

    this.body.quaternion.copy(newQuaternion);
    this.body.position.copy(newPos);
  }

  protected copyBodyTransform() {
    const newPos = new Vector3(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    );

    const newQuaternion = new Quaternion(
      this.body.quaternion.x,
      this.body.quaternion.y,
      this.body.quaternion.z,
      this.body.quaternion.w
    );

    this.object3d.position.copy(newPos);
    this.object3d.quaternion.copy(newQuaternion);
  }

  private updatePhysics() {
    this.body.angularDamping = this.angularDamping;
    this.body.linearDamping = this.linearDamping;
    this.body.mass = this.mass;

    this.copyBodyTransform();
  }
}
