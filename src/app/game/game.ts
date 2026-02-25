import { afterNextRender, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { Mesh, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private cube!: Mesh;

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

      // Camera settings
      this.camera = new PerspectiveCamera( 75, width / height, 0.1, 1000 );


      // Renderer settings
      this.renderer = new WebGLRenderer({ canvas: this.gameContainer.nativeElement });
      this.renderer.setSize(width, height);


      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      this.cube = new THREE.Mesh( geometry, material );
      this.scene.add(this.cube);

      this.camera.position.z = 5;

      // Create a loop to render a scene
      this.renderScene();
    });
  }

  private renderScene() {
    this.renderer.setAnimationLoop(this.animateScene.bind(this));
  }

  private animateScene(time: number) {
    this.cube.rotation.x = time / 2000;
    this.cube.rotation.y = time / 1000;

    this.renderer.render(this.scene, this.camera);
  }

  private adjustGameWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
