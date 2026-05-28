declare module 'three' {
  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    copy(v: Vector3): this;
    clone(): Vector3;
    project(camera: any): this;
    distanceTo(v: Vector3): number;
    lerp(v: Vector3, alpha: number): this;
  }

  export class Vector2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    set(x: number, y: number): this;
  }

  export class Scene {
    background: any;
    fog: any;
    add(object: any): void;
    children: any[];
  }

  export class PerspectiveCamera {
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    position: Vector3;
    aspect: number;
    updateProjectionMatrix(): void;
  }

  export class WebGLRenderer {
    constructor(parameters?: any);
    domElement: HTMLCanvasElement;
    setSize(width: number, height: number): void;
    setPixelRatio(value: number): void;
    shadowMap: any;
    render(scene: Scene, camera: PerspectiveCamera): void;
    dispose(): void;
  }

  export class Raycaster {
    constructor(origin?: Vector3, direction?: Vector3, near?: number, far?: number);
    setFromCamera(coords: Vector2, camera: PerspectiveCamera): void;
    intersectObjects(objects: any[], recursive?: boolean): any[];
    intersectObject(object: any, recursive?: boolean): any[];
  }

  export class Object3D {
    name: string;
    parent: Object3D | null;
    children: Object3D[];
    position: Vector3;
    scale: Vector3;
    rotation: any;
    add(object: Object3D): void;
    traverse(callback: (object: Object3D) => void): void;
  }

  export class Mesh extends Object3D {
    isMesh: boolean;
    material: any;
    castShadow: boolean;
    receiveShadow: boolean;
  }

  export class Sprite extends Object3D {
    material: SpriteMaterial;
  }

  export class Material {
    name: string;
    dispose(): void;
  }

  export class MeshStandardMaterial extends Material {
    color: any;
    map: any;
    roughness: number;
    metalness: number;
    opacity: number;
    transparent: boolean;
    bumpMap: any;
    bumpScale: number;
  }

  export class SpriteMaterial extends Material {
    map: any;
    color: any;
    depthTest: boolean;
    sizeAttenuation: boolean;
  }

  export class AmbientLight {
    constructor(color?: any, intensity?: number);
  }

  export class HemisphereLight {
    constructor(skyColor?: any, groundColor?: any, intensity?: number);
    position: Vector3;
  }

  export class DirectionalLight {
    constructor(color?: any, intensity?: number);
    position: Vector3;
    castShadow: boolean;
    shadow: any;
  }

  export class GridHelper {
    constructor(size?: number, divisions?: number, color1?: any, color2?: any);
    position: Vector3;
  }

  export class FogExp2 {
    constructor(color: any, density?: number);
  }

  export class Color {
    constructor(color?: any);
    setHex(hex: number): this;
    getHex(): number;
  }

  export class CanvasTexture {
    constructor(canvas: HTMLCanvasElement);
    dispose(): void;
  }

  export class Box3 {
    setFromObject(object: Object3D): this;
    getSize(target: Vector3): Vector3;
    getCenter(target: Vector3): Vector3;
  }

  export class Group extends Object3D {}
  
  export interface GLTF {
    scene: Group;
    scenes: Group[];
    animations: any[];
    asset: any;
  }
  
  export class Loader {
    constructor(manager?: any);
  }
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { GLTF, Loader } from 'three';

  export class GLTFLoader extends Loader {
    constructor(manager?: any);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  import { Camera, Vector3 } from 'three';

  export class OrbitControls {
    constructor(object: Camera, domElement?: HTMLElement);
    object: Camera;
    domElement: HTMLElement | HTMLDocument;
    enabled: boolean;
    target: Vector3;
    enableDamping: boolean;
    dampingFactor: number;
    maxPolarAngle: number;
    minDistance: number;
    maxDistance: number;
    update(): boolean;
    dispose(): void;
  }
}
