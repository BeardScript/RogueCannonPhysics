import * as RE from 'rogue-engine';
import * as CANNON from 'cannon-es';
import CannonShape from './CannonShape';

export default class CannonCylinder extends CannonShape {
  shape: CANNON.Cylinder;

  @RE.Prop("Number") radiusTopOffset = 1;
  @RE.Prop("Number") radiusBottomOffset = 1;
  @RE.Prop("Number") heightOffset = 1;
  @RE.Prop("Number") segments = 100;

  protected createShape() {
    this.shape = new CANNON.Cylinder(
      this.radiusTopOffset * this.object3d.scale.x,
      this.radiusBottomOffset * this.object3d.scale.x,
      this.heightOffset * this.object3d.scale.y,
      this.segments
    );
  }
}

RE.registerComponent(CannonCylinder);
