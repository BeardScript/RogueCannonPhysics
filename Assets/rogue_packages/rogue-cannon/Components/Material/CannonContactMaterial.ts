import * as RE from 'rogue-engine';
import CannonConfig from '../CannonConfig';
import * as CANNON from 'cannon-es';

export default class CannonContactMaterial extends RE.Component {
  cannonConfig: CannonConfig;
  contactMaterial: CANNON.ContactMaterial;

  @RE.Prop("String") materialA: string;
  @RE.Prop("String") materialB: string;
  @RE.Prop("Number") friction: number;
  @RE.Prop("Number") restitution: number;

  awake() {
    this.setCannonConfig();
  }

  start() {
    this.createContactMaterial();
  }

  private getMaterial(materialName: string) {
    return this.cannonConfig.world.materials.find(material => material.name === materialName)
  }

  private createContactMaterial() {
    const cannonMaterialA = this.getMaterial(this.materialA);
    const cannonMaterialB = this.getMaterial(this.materialB);

    if (!cannonMaterialA || !cannonMaterialB) return;

    this.contactMaterial = new CANNON.ContactMaterial(cannonMaterialA, cannonMaterialB, {
      friction: this.friction,
      restitution: this.restitution,
    });

    this.contactMaterial.friction = this.friction;
    this.contactMaterial.restitution = this.restitution;

    this.cannonConfig.world.addContactMaterial(this.contactMaterial);
  }

  private setCannonConfig() {
    const config = RE.App.currentScene.getObjectByName("Config");

    if (config) {
      this.cannonConfig = RE.getComponent(CannonConfig, config) as CannonConfig;
    }
  }
}

RE.registerComponent(CannonContactMaterial);
