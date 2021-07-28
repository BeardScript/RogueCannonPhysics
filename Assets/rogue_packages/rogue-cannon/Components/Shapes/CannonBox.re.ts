import * as RE from 'rogue-engine';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonShape from './CannonShape';

export default class CannonBox extends CannonShape {
  shape: CANNON.Box;
  @RE.Prop("Vector3") sizeOffset: THREE.Vector3 = new THREE.Vector3(1, 1, 1);

  protected createShape() {
    this.shape = new CANNON.Box(
      new CANNON.Vec3(
        this.sizeOffset.x * (this.object3d.scale.x/2),
        this.sizeOffset.y * (this.object3d.scale.y/2),
        this.sizeOffset.z * (this.object3d.scale.z/2)
      )
    );
  }
}

RE.registerComponent(CannonBox);
