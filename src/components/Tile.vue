<template>
  <div/>
</template>

<script lang="ts">
import * as THREE from 'three';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import anime from 'animejs';
import Board from './Board.vue';
import { generateNumGeometry, tileGeometry } from '../geometries';
import { numMaterial, tileMaterial } from '../materials';

@Component<Tile>({
  mounted() {
    this.$nextTick(() => {
      const position = this.getPosition();
      this.$parent.object3D.add(this.object3D);
      this.object3D.scale.setScalar(1e-5);
      this.object3D.position.y = 0.2;
      this.object3D.position.x = position.x;
      this.object3D.position.z = position.y;
      this.object3D.add(
        new THREE.Mesh(generateNumGeometry(this.value), numMaterial),
      );
      this.animation = anime({
        targets: this.object3D.scale,
        easing: 'easeInQuad',
        elasticity: 0,
        duration: 250,
        complete: () => {
          this.animation = undefined;
        },
        x: 1,
        y: 1,
        z: 1,
      });
    });
  },
  destroyed() {
    this.$nextTick(() => {
      this.animation = anime({
        targets: this.object3D.scale,
        easing: 'easeInQuad',
        elasticity: 0,
        duration: 250,
        complete: () => {
          this.$parent.object3D.remove(this.object3D);
          this.animation = undefined;
        },
        x: 1e-5,
        y: 1e-5,
        z: 1e-5,
      });
    });
  },
})
export default class Tile extends Vue {
  @Prop({ type: Number, required: true })
  private x!: number;

  @Prop({ type: Number, required: true })
  private y!: number;

  @Prop({ type: Number, required: true })
  private value!: number;

  private object3D = new THREE.Mesh(tileGeometry, tileMaterial);

  private animation?: anime.AnimeInstance;

  $parent!: Board;

  @Watch('x')
  onMoveX() {
    this.onMove();
  }

  @Watch('y')
  onMoveY() {
    this.onMove();
  }

  @Watch('value')
  onValueChanged() {
    const num = this.object3D.children[0] as THREE.Mesh;
    num.geometry = generateNumGeometry(this.value);
  }

  private onMove() {
    const newPosition = this.getPosition();
    this.animation = anime({
      targets: this.object3D.position,
      easing: 'easeInQuad',
      elasticity: 0,
      duration: 250,
      complete: () => {
        this.animation = undefined;
      },
      x: newPosition.x,
      z: newPosition.y,
    });
  }

  private getPosition() {
    const boardSize = this.$parent.getBoardSize();
    const marginSize = this.$parent.getMarginSize();
    const baseX = -(boardSize / 2 - 0.5);
    const baseY = -(boardSize / 2 - 0.5);

    return {
      x: baseX + this.x + (this.x + 1) * marginSize,
      y: baseY + this.y + (this.y + 1) * marginSize,
    };
  }
}
</script>

<style>
</style>
