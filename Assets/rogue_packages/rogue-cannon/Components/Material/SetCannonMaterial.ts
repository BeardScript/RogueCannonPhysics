import * as RE from 'rogue-engine';
import CannonConfig from '../CannonConfig';
import * as CANNON from 'cannon-es';
import CannonBody from '../Shapes/CannonBody';

export default class SetCannonMaterial extends RE.Component {
  cannonConfig: CannonConfig;
  material: CANNON.Material;

  @RE.Prop("String") materialName: string;

  awake() {
    this.setCannonConfig();
  }

  start() {
    this.setMaterial();
  }

  private getMaterial() {
    return this.cannonConfig.world.materials.find(material => material.name === this.materialName)
  }

  private setMaterial() {
    const material = this.getMaterial();

    if (!material) return;

    this.material = material;

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

RE.registerComponent(SetCannonMaterial);
