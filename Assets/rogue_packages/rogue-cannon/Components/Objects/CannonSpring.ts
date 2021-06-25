import * as RE from 'rogue-engine';
import CannonConfig from '../CannonConfig';
import { Vector3, Object3D } from 'three';
import * as CANNON from 'cannon-es';
import CannonBody from '../Shapes/CannonBody';

const { Prop } = RE;

export default class CannonSpring extends RE.Component {
  cannonConfig: CannonConfig;
  spring: CANNON.Spring;
  targetBody: CANNON.Body;
  
  @Prop("Object3D") target: Object3D;
  @Prop("Vector3") anchorA: Vector3 = new Vector3();
  @Prop("Vector3") anchorB: Vector3 = new Vector3();
  @Prop("Number") restLength: number = 0;
  @Prop("Number") stiffness: number = 50;
  @Prop("Number") damping: number = 1;

  awake() {
    this.setCannonConfig();
  }

  start() {
    this.createSpring();
  }

  private setCannonConfig() {
    const config = RE.App.currentScene.getObjectByName("Config");

    if (config) {
      this.cannonConfig = RE.getComponent(CannonConfig, config) as CannonConfig;
    }
  }

  private getCannonBodyComponent(object3d: Object3D): CannonBody {
    const cannonBody = RE.getComponent(CannonBody, object3d);

    if (!cannonBody) {
      throw "CannonSpring targets must have a Cannon Body Component"
    }

    return cannonBody;
  }

  applyForce = () => {
    this.spring.applyForce();
  }

  private createSpring() {
    if (!this.target) throw "CannonSpring requires a target";

    const bodyA = this.getCannonBodyComponent(this.object3d).body;
    const bodyB = this.getCannonBodyComponent(this.target).body;

    this.spring = new CANNON.Spring(bodyA, bodyB, {
      localAnchorA: new CANNON.Vec3(this.anchorA.x, this.anchorA.y, this.anchorA.z),
      localAnchorB: new CANNON.Vec3(this.anchorB.x, this.anchorB.y, this.anchorB.z),
      restLength: this.restLength,
      stiffness: this.stiffness,
      damping: this.damping,
    });

    this.cannonConfig.world.addEventListener('postStep', this.applyForce)
  }

  onBeforeRemoved() {
    this.cannonConfig.world.removeEventListener('postStep', this.applyForce);
  }
}

RE.registerComponent(CannonSpring);
