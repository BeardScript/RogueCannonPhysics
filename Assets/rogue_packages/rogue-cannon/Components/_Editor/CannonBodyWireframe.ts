import * as RE from 'rogue-engine';
import * as THREE from 'three';
import { Box3, BoxBufferGeometry, BoxGeometry, Color, CylinderBufferGeometry, Mesh, MeshStandardMaterial, Object3D, SphereBufferGeometry } from 'three';
import CannonBody from '../Shapes/CannonBody';
import CannonBoxBody from '../Shapes/CannonBoxBody';
import CannonCylinderBody from '../Shapes/CannonCylinderBody';
import CannonSphereBody from '../Shapes/CannonSphereBody';

export default class CannonBodyWireframe extends RE.Component {
  static isEditorComponent = true;

  selectedObjects: Object3D[] = [];
  wireframeMaterial = new MeshStandardMaterial({wireframe: true, emissive: new Color("#00FF00"), color: new Color("#000000")});

  private objectWorldScale: THREE.Vector3 = new THREE.Vector3();

  update() {
    const selectedObjects = window["rogue-editor"].Project.selectedObjects as Object3D[];

    if (selectedObjects.length !== this.selectedObjects.length) {
      this.selectedObjects.forEach((object) => {
        let bBox = RE.App.currentScene.getObjectByName("EDITOR_OBJECT_BB_" + object.uuid);
        bBox && RE.App.currentScene.remove(bBox);
      });

      this.selectedObjects = [];
    }

    selectedObjects.forEach((object, i) => {
      const component = RE.getComponent(CannonBody, object);

      if (this.selectedObjects.indexOf(object) < 0) {
        this.selectedObjects.push(object);
      }

      if (!component) return;

      let bBox = RE.App.currentScene.getObjectByName("EDITOR_OBJECT_BB_" + object.uuid);

      if (!bBox) {
        bBox = this.getColliderMesh(component);

        if (bBox) {
          bBox.name = "EDITOR_OBJECT_BB_" + object.uuid;
          bBox.userData.isEditorObject = true;
          RE.App.currentScene.add(bBox);
        } else {
          return;
        }
      }

      this.updateColliderMesh(component, bBox as Mesh);
    });
  }

  private getColliderMesh(component: CannonBody): Mesh | undefined {
    if (component instanceof CannonBoxBody) {
      return new Mesh(
        new BoxBufferGeometry(),
        this.wireframeMaterial,
      );
    }

    if (component instanceof CannonCylinderBody) {
      component.object3d.getWorldScale(this.objectWorldScale);
      const radiusTop = component.radiusTopOffset * this.objectWorldScale.x
      const radiusBottom = component.radiusBottomOffset * this.objectWorldScale.x;
      const height = component.heightOffset;
      return new Mesh(
        new CylinderBufferGeometry(radiusTop, radiusBottom, height, component.segments),
        this.wireframeMaterial,
      );
    }

    if (component instanceof CannonSphereBody) {
      component.bbox = new Box3().setFromObject(component.object3d);

      const bbox = component.bbox;
      const xDiff = (bbox.max.x - bbox.min.x);
      const yDiff = (bbox.max.y - bbox.min.y);
      const zDiff = (bbox.max.z - bbox.min.z);

      const maxSide = Math.max(xDiff, yDiff, zDiff);
      const radius = component.radiusOffset * (maxSide/2);
      const compensatedRadius = radius + (radius * 0.01);
      const segments = 25 * compensatedRadius;

      return new Mesh(
        new SphereBufferGeometry(compensatedRadius, segments, segments),
        this.wireframeMaterial,
      );
    }

    return;
  }

  private updateColliderMesh(component: CannonBody, mesh: Mesh) {
    if (component instanceof CannonBoxBody) {
      component.object3d.getWorldScale(mesh.scale);

      mesh.scale.set(
        component.sizeOffset.x * (mesh.scale.x),
        component.sizeOffset.y * (mesh.scale.y),
        component.sizeOffset.z * (mesh.scale.z)
      );
    }

    if (component instanceof CannonCylinderBody) {
      const radiusTop = component.radiusTopOffset * component.object3d.scale.x
      const radiusBottom = component.radiusBottomOffset * component.object3d.scale.x;
      const height = component.heightOffset;

      if (mesh.geometry instanceof CylinderBufferGeometry) {
        if (
          mesh.geometry.parameters.radiusTop !== radiusTop ||
          mesh.geometry.parameters.radiusBottom !== radiusBottom ||
          mesh.geometry.parameters.height !== height ||
          mesh.geometry.parameters.radialSegments !== component.segments
        ) {
          mesh.geometry.dispose();
          mesh.geometry = new CylinderBufferGeometry(radiusTop, radiusBottom, height, component.segments)
        }
      }

      component.object3d.getWorldScale(mesh.scale);
    }

    if (component instanceof CannonSphereBody) {
      component.bbox = new Box3().setFromObject(component.object3d);

      const bbox = component.bbox;
      const xDiff = (bbox.max.x - bbox.min.x);
      const yDiff = (bbox.max.y - bbox.min.y);
      const zDiff = (bbox.max.z - bbox.min.z);

      const maxSide = Math.max(xDiff, yDiff, zDiff);
      const radius = component.radiusOffset * (maxSide/2);

      if (mesh.geometry instanceof SphereBufferGeometry) {
        if (mesh.geometry.parameters.radius !== radius) {
          const segments = 25 * radius;

          mesh.geometry.dispose();
          mesh.geometry = new SphereBufferGeometry(radius, segments, segments);
        }
      }
    }

    component.object3d.getWorldPosition(mesh.position);
    component.object3d.getWorldQuaternion(mesh.quaternion);
  }
}

RE.registerComponent(CannonBodyWireframe);
