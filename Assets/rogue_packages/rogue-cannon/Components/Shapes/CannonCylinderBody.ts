import * as RE from 'rogue-engine';
import * as CANNON from 'cannon-es';
import CannonBody from './CannonBody';
import { Box3 } from 'three';

const { Prop } = RE;

export default class CannonCylinderBody extends CannonBody {
  shape: CANNON.Cylinder;
  
  @Prop("Number") angularDamping = 0;
  @Prop("Number") linearDamping = 0;
  @Prop("Number") mass = 1;
  @Prop("Number") radiusTopOffset = 1;
  @Prop("Number") radiusBottomOffset = 1;
  @Prop("Number") heightOffset = 1;
  @Prop("Number") segments = 100;

  protected createShape() {
    this.shape = new CANNON.Cylinder(
      this.radiusTopOffset * this.object3d.scale.x,
      this.radiusBottomOffset * this.object3d.scale.x,
      this.heightOffset * this.object3d.scale.y,
      this.segments
    );
  }
}

RE.registerComponent(CannonCylinderBody);
