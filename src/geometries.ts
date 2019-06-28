import * as THREE from 'three';
import roboto from './assets/roboto.json';

interface NumGeometryCache {
  [key: string]: THREE.BufferGeometry;
}

const font = new THREE.FontLoader().parse(roboto);

const cache: NumGeometryCache = {};

export function generateBoardGeometry(boardSize: number) {
  return new THREE.BoxBufferGeometry(boardSize, 0.2, boardSize);
}

export function generateEdgeGeometry(boardSize: number, marginSize: number) {
  return new THREE.BoxBufferGeometry(boardSize + 4 * marginSize, 2 * marginSize, 2 * marginSize);
}

export function generateNumGeometry(num: number) {
  if (!cache[num]) {
    cache[num] = new THREE.TextBufferGeometry(num.toString(), {
      font,
      size: 0.4,
      height: 0.4,
    })
      .center()
      .rotateX(Math.PI / 2)
      .rotateY(Math.PI)
      .rotateZ(Math.PI);
  }
  return cache[num];
}

export const tileGeometry = new THREE.BoxBufferGeometry(1, 0.2, 1);
