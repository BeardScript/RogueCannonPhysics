import * as RE from 'rogue-engine';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonShape from './CannonShape';

export default class CannonSphere extends CannonShape {
  @RE.Prop("Number") radiusOffset: number = 1;
  shape: CANNON.Sphere;
  bbox: THREE.Box3;

  protected createShape() {
    this.bbox = new THREE.Box3().setFromObject(this.object3d);

    const bbox = this.bbox;

    const xDiff = (bbox.max.x - bbox.min.x);
    const yDiff = (bbox.max.y - bbox.min.y);
    const zDiff = (bbox.max.z - bbox.min.z);

    let maxSide = Math.max(xDiff, yDiff, zDiff);

    if (maxSide < 0) {
      const scale = this.object3d.scale;
      maxSide = Math.max(scale.x, scale.y, scale.z);
    }

    this.shape = new CANNON.Sphere(
      this.radiusOffset * (maxSide/2)
    );
  }
}

RE.registerComponent(CannonSphere);
