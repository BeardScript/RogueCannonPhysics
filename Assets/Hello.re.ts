import * as RE from 'rogue-engine';

export default class Hello extends RE.Component {
  @RE.Prop("Prefab") obj: RE.Prefab;

  awake() {

  }

  start() {

  }

  update() {

  }
}

RE.registerComponent(Hello);
