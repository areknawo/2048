import * as THREE from 'three';

function hashFunc(func: Function) {
  return func
    .toString()
    .split('')
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
}

interface RaycasterListeners {
  [event: string]:
    | {
        [hash: string]: ((event: PointerEvent) => void) | undefined;
      }
    | undefined;
}

type PointerEventNames =
  | 'gotpointercapture'
  | 'lostpointercapture'
  | 'pointercancel'
  | 'pointerdown'
  | 'pointerenter'
  | 'pointerleave'
  | 'pointermove'
  | 'pointerout'
  | 'pointerover'
  | 'pointerup';

export default class Raycaster {
  private listeners: RaycasterListeners = {};

  private raycaster = new THREE.Raycaster();

  private mouse = new THREE.Vector2();

  private camera: THREE.Camera;

  private element: HTMLElement;

  constructor(camera: THREE.Camera, element: HTMLElement) {
    this.camera = camera;
    this.element = element;
  }

  private raycast(
    event: PointerEvent,
    object3D: THREE.Object3D,
    handler: (event: PointerEvent) => void,
  ) {
    this.mouse.x = (event.clientX / this.element.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.element.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersection = this.raycaster.intersectObjects([object3D])[0];
    if (intersection) {
      handler(event);
    }
  }

  on(
    eventName: PointerEventNames,
    object3D: THREE.Object3D,
    handler: (event: PointerEvent) => void,
  ) {
    if (!this.listeners[eventName]) this.listeners[eventName] = {};
    const listener = (event: PointerEvent) => this.raycast(event, object3D, handler);
    const listeners = this.listeners[eventName];
    const hashedHandler = hashFunc(handler);
    listeners![hashedHandler] = listener;
    this.element.addEventListener(eventName, listener);
  }

  off(eventName: PointerEventNames, handler: () => void) {
    const hashedHandler = hashFunc(handler);
    const listeners = this.listeners[eventName];
    if (listeners) {
      const listener = listeners[hashedHandler];
      if (listener) {
        this.element.removeEventListener(eventName, listener);
        listeners[hashedHandler] = undefined;
      }
    }
  }
}
