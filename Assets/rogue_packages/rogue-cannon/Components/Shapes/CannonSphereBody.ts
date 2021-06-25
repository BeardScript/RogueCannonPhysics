import * as RE from 'rogue-engine';
import * as CANNON from 'cannon-es';
import CannonBody from './CannonBody';
import { Box3 } from 'three';

const { Prop } = RE;

export default class CannonSphereBody extends CannonBody {
  shape: CANNON.Sphere;
  bbox: Box3;
  
  @Prop("Number") angularDamping = 0;
  @Prop("Number") linearDamping = 0;
  @Prop("Number") mass = 1;
  @Prop("Number") radiusOffset: number = 1;

  protected createShape() {
    this.bbox = new Box3().setFromObject(this.object3d);

    const bbox = this.bbox;

    const xDiff = (bbox.max.x - bbox.min.x);
    const yDiff = (bbox.max.y - bbox.min.y);
    const zDiff = (bbox.max.z - bbox.min.z);

    const maxSide = Math.max(xDiff, yDiff, zDiff)

    this.shape = new CANNON.Sphere(
      this.radiusOffset * (maxSide/2)
    );
  }
}

RE.registerComponent(CannonSphereBody);
