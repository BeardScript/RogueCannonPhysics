import * as RE from 'rogue-engine';
import CannonConfig from '../CannonConfig';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export default class CannonBody extends RE.Component {
  cannonConfig: CannonConfig;
  shape: CANNON.Shape;
  body: CANNON.Body;
  angularDamping = 0;
  linearDamping = 0;
  mass = 1;

  private worldPos = new THREE.Vector3();
  private worldRot = new THREE.Quaternion();
  private newBodyPos = new CANNON.Vec3();
  private newBodyRot = new CANNON.Quaternion();

  private newPos = new THREE.Vector3();
  private newRot = new THREE.Quaternion();
  private matrixA = new THREE.Matrix4();
  private matrixB = new THREE.Matrix4();
  private matrixC = new THREE.Matrix4();

  awake() {
    this.setCannonConfig();
    this.createShape();
    this.createBody();
  }

  start() {
    this.cannonConfig.world.addBody(this.body);
  }

  update() {
    this.updatePhysics();
  }

  onBeforeRemoved() {
    this.cannonConfig.world.removeBody(this.body);
  }

  private setCannonConfig() {
    const config = RE.App.currentScene.getObjectByName("Config");

    if (config) {
      this.cannonConfig = RE.getComponent(CannonConfig, config) as CannonConfig;
    }
  }

  private createBody() {
    this.body = new CANNON.Body({
      angularDamping: this.angularDamping,
      linearDamping: this.linearDamping,
      mass: this.mass
    });

    this.body.addShape(this.shape);
    this.copyObjectTransform();
  }

  protected createShape(): void {};

  protected copyObjectTransform() {
    this.object3d.getWorldPosition(this.worldPos);
    this.object3d.getWorldQuaternion(this.worldRot);

    this.newBodyPos.set(
      this.worldPos.x,
      this.worldPos.y,
      this.worldPos.z
    );

    this.newBodyRot.set(
      this.worldRot.x,
      this.worldRot.y,
      this.worldRot.z,
      this.worldRot.w
    );

    this.body.quaternion.copy(this.newBodyRot);
    this.body.position.copy(this.newBodyPos);
  }

  protected copyBodyTransform() {
    this.copyBodyPosition();
    this.copyBodyRotation();
  }

  private copyBodyPosition() {
    this.newPos.set(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    );

    this.object3d.parent?.worldToLocal(this.newPos);
    this.object3d.position.copy(this.newPos);
  }

  private copyBodyRotation() {
    this.newRot.set(
      this.body.quaternion.x,
      this.body.quaternion.y,
      this.body.quaternion.z,
      this.body.quaternion.w
    );

    this.matrixA.makeRotationFromQuaternion(this.newRot);
    this.object3d.updateMatrixWorld();
    this.matrixB.getInverse((this.object3d.parent as THREE.Object3D).matrixWorld);
    this.matrixC.extractRotation(this.matrixB);
    this.matrixA.premultiply(this.matrixC);
    this.object3d.quaternion.setFromRotationMatrix(this.matrixA);
  }

  private updatePhysics() {
    this.body.angularDamping = this.angularDamping;
    this.body.linearDamping = this.linearDamping;
    this.body.mass = this.mass;

    this.copyBodyTransform();
  }
}
