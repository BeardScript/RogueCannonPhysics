import * as RE from 'rogue-engine';
import { Box3, BoxBufferGeometry, BoxGeometry, Color, CylinderBufferGeometry, Mesh, MeshStandardMaterial, Object3D, SphereBufferGeometry } from 'three';
import CannonBody from '../Shapes/CannonBody';
import CannonBoxBody from '../Shapes/CannonBoxBody';
import CannonCylinderBody from '../Shapes/CannonCylinderBody';
import CannonSphereBody from '../Shapes/CannonSphereBody';

export default class CannonBodyWireframe extends RE.Component {
  static isEditorComponent = true;

  selectedObjects: Object3D[] = [];

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
        new MeshStandardMaterial({wireframe: true, emissive: new Color("#00FF00"), color: new Color("#000000")}),
      );
    }

    if (component instanceof CannonCylinderBody) {
      const radiusTop = component.radiusTopOffset * component.object3d.scale.x
      const radiusBottom = component.radiusBottomOffset * component.object3d.scale.x;
      const height = component.heightOffset;
      return new Mesh(
        new CylinderBufferGeometry(radiusTop, radiusBottom, height, component.segments),
        new MeshStandardMaterial({wireframe: true, emissive: new Color("#00FF00"), color: new Color("#000000")}),
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
        new MeshStandardMaterial({wireframe: true, emissive: new Color("#00FF00"), color: new Color("#000000")}),
      );
    }

    return;
  }

  private updateColliderMesh(component: CannonBody, mesh: Mesh) {
    if (component instanceof CannonBoxBody) {
      const x = component.sizeOffset.x * (component.object3d.scale.x);
      const y = component.sizeOffset.y * (component.object3d.scale.y);
      const z = component.sizeOffset.z * (component.object3d.scale.z);

      mesh.scale.set(x, y, z);
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

      mesh.scale.copy(component.object3d.scale);
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

    mesh.position.copy(component.object3d.position);
    mesh.rotation.copy(component.object3d.rotation);
  }
}

RE.registerComponent(CannonBodyWireframe);
