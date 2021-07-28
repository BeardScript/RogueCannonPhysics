import * as RE from 'rogue-engine';
import * as THREE from 'three';

import CannonBox from '../Shapes/CannonBox.re';
import CannonSphere from '../Shapes/CannonSphere.re';
import CannonShape from '../Shapes/CannonShape';
import CannonCylinder from '../Shapes/CannonCylinder.re';

export default class CannonBodyWireframe extends RE.Component {
  static isEditorComponent = true;

  selectedObjects: THREE.Object3D[] = [];
  colliders: THREE.Object3D[] = [];
  wireframeMaterial = new THREE.MeshStandardMaterial({wireframe: true, emissive: new THREE.Color("#00FF00"), color: new THREE.Color("#000000")});

  private objectWorldScale: THREE.Vector3 = new THREE.Vector3();

  private handleOnComponentAdded = {stop: () => {}};
  private handleOnComponentRemoved = {stop: () => {}};

  private resetHandler = (component: RE.Component) => {
    component instanceof CannonShape && this.setupImpostors();
  }

  start() {
    this.handleOnComponentAdded.stop();
    this.handleOnComponentRemoved.stop();

    this.handleOnComponentAdded = RE.onComponentAdded(this.resetHandler);
    this.handleOnComponentRemoved = RE.onComponentRemoved(this.resetHandler);
  }

  afterUpdate() {
    const selectedObjects = window["rogue-editor"].Project.selectedObjects as THREE.Object3D[];

    if (!this.arraysAreEqual(selectedObjects, this.selectedObjects)) {
      this.selectedObjects = selectedObjects.slice(0);
      this.setupImpostors();
    }

    if (this.selectedObjects.length === 0) return;

    this.updateImpostors();
  }

  private updateImpostors() {
    this.colliders.forEach(impostor => {
      this.updateColliderMesh(impostor.userData.cannonShape, impostor as THREE.Mesh);
    });
  }

  private cleanupImpostors() {
    this.colliders.forEach(impostor => {
      impostor.userData.cannonShape = null;
      RE.App.currentScene.remove(impostor);
      RE.dispose(impostor);
    });

    this.colliders = [];
  }

  private setupImpostors() {
    this.cleanupImpostors();

    this.selectedObjects.forEach(selected => {
      selected.traverse(object => {
        const objComponents = RE.components[object.uuid];

        if (!objComponents) return;

        objComponents.forEach(component => {
          if (!(component instanceof CannonShape)) return;

          let impostor = RE.App.currentScene.getObjectByName("EDITOR_OBJECT_BB_" + object.uuid);

          if (impostor) return;

          impostor = this.getColliderMesh(component);

          if (impostor) {
            impostor.name = "EDITOR_OBJECT_BB_" + object.uuid;
            impostor.userData.isEditorObject = true;
            RE.App.currentScene.add(impostor);
          } else {
            return;
          }

          impostor.userData.cannonShape = component;
          this.colliders.push(impostor);
        });
      });
    });
  }

  private arraysAreEqual(array1: any[], array2: any[]) {
    if (array1.length !== array2.length) return false;

    return array1.every((element, i) => {
      return array2[i] === element;
    });
  }

  private getColliderMesh(component: CannonShape): THREE.Mesh | undefined {
    if (component instanceof CannonBox) {
      return new THREE.Mesh(
        new THREE.BoxBufferGeometry(),
        this.wireframeMaterial,
      );
    }

    if (component instanceof CannonCylinder) {
      component.object3d.getWorldScale(this.objectWorldScale);
      const radiusTop = component.radiusTopOffset * this.objectWorldScale.x
      const radiusBottom = component.radiusBottomOffset * this.objectWorldScale.x;
      const height = component.heightOffset;
      return new THREE.Mesh(
        new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, component.segments),
        this.wireframeMaterial,
      );
    }

    if (component instanceof CannonSphere) {
      component.bbox = new THREE.Box3().setFromObject(component.object3d);
      const bbox = component.bbox;
      const xDiff = (bbox.max.x - bbox.min.x);
      const yDiff = (bbox.max.y - bbox.min.y);
      const zDiff = (bbox.max.z - bbox.min.z);

      let maxSide = Math.max(xDiff, yDiff, zDiff);

      if (maxSide < 0) {
        const scale = component.object3d.scale;
        maxSide = Math.max(scale.x, scale.y, scale.z);
      }

      const radius = component.radiusOffset * (maxSide/2);
      const compensatedRadius = radius + (radius * 0.01);
      const segments = 15;

      return new THREE.Mesh(
        new THREE.SphereBufferGeometry(compensatedRadius, segments, segments),
        this.wireframeMaterial,
      );
    }

    return;
  }

  private updateColliderMesh(component: CannonShape, mesh: THREE.Mesh) {
    if (component instanceof CannonBox) {
      component.object3d.getWorldScale(mesh.scale);

      mesh.scale.set(
        component.sizeOffset.x * (mesh.scale.x),
        component.sizeOffset.y * (mesh.scale.y),
        component.sizeOffset.z * (mesh.scale.z)
      );
    }

    if (component instanceof CannonCylinder) {
      const radiusTop = component.radiusTopOffset * component.object3d.scale.x
      const radiusBottom = component.radiusBottomOffset * component.object3d.scale.x;
      const height = component.heightOffset;

      if (mesh.geometry instanceof THREE.CylinderBufferGeometry) {
        if (
          mesh.geometry.parameters.radiusTop !== radiusTop ||
          mesh.geometry.parameters.radiusBottom !== radiusBottom ||
          mesh.geometry.parameters.height !== height ||
          mesh.geometry.parameters.radialSegments !== component.segments
        ) {
          mesh.geometry.dispose();
          mesh.geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, component.segments)
        }
      }

      component.object3d.getWorldScale(mesh.scale);
    }

    if (component instanceof CannonSphere) {
      component.bbox = new THREE.Box3().setFromObject(component.object3d);

      const bbox = component.bbox;
      const xDiff = (bbox.max.x - bbox.min.x);
      const yDiff = (bbox.max.y - bbox.min.y);
      const zDiff = (bbox.max.z - bbox.min.z);

      let maxSide = Math.max(xDiff, yDiff, zDiff);

      if (maxSide < 0) {
        const scale = component.object3d.scale;
        maxSide = Math.max(scale.x, scale.y, scale.z);
      }

      const radius = component.radiusOffset * (maxSide/2);

      if (mesh.geometry instanceof THREE.SphereBufferGeometry) {
        if (mesh.geometry.parameters.radius !== radius) {
          let segments = 10 * radius;

          if (segments < 15) segments = 15;

          if (segments > 50) segments = 50;

          mesh.geometry.dispose();
          mesh.geometry = new THREE.SphereBufferGeometry(radius, segments, segments);
        }
      }
    }

    component.object3d.getWorldPosition(mesh.position);
    component.object3d.getWorldQuaternion(mesh.quaternion);
  }

  onBeforeRemoved() {
    this.handleOnComponentAdded.stop();
    this.handleOnComponentRemoved.stop();
    this.cleanupImpostors();
  }
}

RE.registerComponent(CannonBodyWireframe);
