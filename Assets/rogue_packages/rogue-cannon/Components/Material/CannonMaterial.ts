import * as RE from 'rogue-engine';
import CannonConfig from '../CannonConfig';
import * as CANNON from 'cannon-es';
import CannonBody from '../Shapes/CannonBody';

const { Prop } = RE;

export default class CannonMaterial extends RE.Component {
  cannonConfig: CannonConfig;
  material: CANNON.Material;

  @Prop("Number") friction: number;
  @Prop("Number") restitution: number;

  awake() {
    this.setCannonConfig();
    this.createMaterial();
  }

  start() {
    this.setMaterial();
  }

  protected createMaterial() {
    this.material = new CANNON.Material(this.name);

    // if (this.friction < 0)
      this.material.friction = this.friction;
    // if (this.restitution < 0)
    this.material.restitution = this.restitution;

    this.cannonConfig.world.addMaterial(this.material);
  }

  private setMaterial() {
    const cannonBody = RE.getComponent(CannonBody, this.object3d);

    if (cannonBody) {
      cannonBody.shape.material = this.material;
    }
  }

  private setCannonConfig() {
    const config = RE.App.currentScene.getObjectByName("Config");

    if (config) {
      this.cannonConfig = RE.getComponent(CannonConfig, config) as CannonConfig;
    }
  }
}

RE.registerComponent(CannonMaterial);
