import { afterNextRender, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { Mesh, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private cameraControls!: OrbitControls;
  private renderer!: WebGLRenderer;
  private cube!: Mesh;
  private loader!: GLTFLoader;

  @ViewChild('game', { static: true }) gameContainer!: ElementRef<HTMLCanvasElement>;

  @HostListener('window:resize')
  onResize() {
    this.adjustGameWindowSize();
  }


  constructor() {
    afterNextRender(() => {
      this.scene = new Scene();
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Renderer settings
      this.renderer = new WebGLRenderer({ canvas: this.gameContainer.nativeElement });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


      // Camera settings
      this.camera = new PerspectiveCamera( 75, width / height, 0.1, 1000 );

      // Camera movement setting
      this.cameraControls = new OrbitControls(this.camera, this.gameContainer.nativeElement);
      this.cameraControls.update();


      // Load GLTF objects
      this.loadObjects();

      // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      // this.cube = new THREE.Mesh( geometry, material );
      // this.scene.add(this.cube);

      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.AmbientLight(color, intensity);
      this.scene.add(light);

      this.camera.position.z = 5;

      // Create a loop to render a scene
      this.renderScene();
    });
  }

  private renderScene() {
    this.renderer.setAnimationLoop(this.animateScene.bind(this));
  }

  private animateScene(time: number) {
    this.renderer.render(this.scene, this.camera);
  }

  private loadObjects() {
    this.loader = new GLTFLoader();

    this.loadObject('User1');
  }

  private loadObject(name: string) {
    this.loader.load(
      `/models/${name}.glb`,
      (object) => {
        this.scene.add(object.scene);
      },
      (progress) => {
        console.log(progress);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private adjustGameWindowSize() {
    if (window) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
}
