<template>
  <div class="scene" ref="scene">
    <Board :size="4"/>
  </div>
</template>

<script lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Component, Vue } from 'vue-property-decorator';
import Raycaster from '../raycaster';
import Board from './Board.vue';

@Component<Scene>({
  components: { Board },
  mounted() {
    const el = this.$refs.scene as Element;
    const aspect = el.clientWidth / el.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.raycaster = new Raycaster(this.camera, this.renderer.domElement);

    this.renderer.setSize(el.clientWidth, el.clientHeight);

    this.scene.add(
      this.ambientLight,
      this.hemisphereLight,
      this.directionalLight,
    );
    this.directionalLight.position.set(150, 350, 350);

    el.appendChild(this.renderer.domElement);
    this.controls.enablePan = false;
    this.camera.position.z = 5;

    this.animate();
  },
})
export default class Scene extends Vue {
  private hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  private directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);

  private ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);

  private renderer = new THREE.WebGLRenderer({ alpha: true });

  private camera!: THREE.PerspectiveCamera;

  private controls!: OrbitControls;

  raycaster!: Raycaster;

  scene = new THREE.Scene();

  private animate() {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    requestAnimationFrame(this.animate);
  }
}
</script>

<style scoped>
.scene {
  width: 100%;
  height: 100%;
}
</style>
