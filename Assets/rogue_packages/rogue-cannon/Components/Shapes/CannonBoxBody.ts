import * as RE from 'rogue-engine';
import { BoxBufferGeometry, BoxGeometry, Color, Material, Mesh, MeshStandardMaterial, Object3D, Vector3, WireframeGeometry } from 'three';
import * as CANNON from 'cannon-es';
import CannonBody from './CannonBody';

const { Prop } = RE;

export default class CannonBoxBody extends CannonBody {
  shape: CANNON.Box;

  @Prop("Number") angularDamping = 0;
  @Prop("Number") linearDamping = 0;
  @Prop("Number") mass = 1;
  @Prop("Vector3") sizeOffset: Vector3 = new Vector3(1, 1, 1);

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

RE.registerComponent(CannonBoxBody);
