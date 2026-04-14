import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { world } from './physics';

const FLOOR_TILE = 2;
const WALL_HEIGHT = 3;
const WALL_THICK = 1;

export function buildArena(scene: THREE.Scene, size: number): void {
  const half = size / 2;

  const tilesPerSide = size / FLOOR_TILE;
  const tileGeo = new THREE.BoxGeometry(FLOOR_TILE * 0.98, 0.2, FLOOR_TILE * 0.98);
  const tileMat = new THREE.MeshLambertMaterial({ color: 0x303040 });
  const tileMatAlt = new THREE.MeshLambertMaterial({ color: 0x383848 });
  const tileMesh = new THREE.InstancedMesh(tileGeo, tileMat, tilesPerSide * tilesPerSide);
  const tileMeshAlt = new THREE.InstancedMesh(tileGeo, tileMatAlt, tilesPerSide * tilesPerSide);
  let normalIdx = 0;
  let altIdx = 0;
  const m = new THREE.Matrix4();
  for (let x = 0; x < tilesPerSide; x++) {
    for (let z = 0; z < tilesPerSide; z++) {
      const px = -half + FLOOR_TILE / 2 + x * FLOOR_TILE;
      const pz = -half + FLOOR_TILE / 2 + z * FLOOR_TILE;
      m.makeTranslation(px, -0.1, pz);
      if ((x + z) % 2 === 0) tileMesh.setMatrixAt(normalIdx++, m);
      else tileMeshAlt.setMatrixAt(altIdx++, m);
    }
  }
  tileMesh.count = normalIdx;
  tileMeshAlt.count = altIdx;
  tileMesh.instanceMatrix.needsUpdate = true;
  tileMeshAlt.instanceMatrix.needsUpdate = true;
  scene.add(tileMesh, tileMeshAlt);

  world.createCollider(
    RAPIER.ColliderDesc.cuboid(half, 0.1, half).setTranslation(0, -0.1, 0),
  );

  const wallMat = new THREE.MeshLambertMaterial({ color: 0x553322 });
  const walls: Array<[number, number, number, number]> = [
    [0, half + WALL_THICK / 2, size + WALL_THICK * 2, WALL_THICK],
    [0, -half - WALL_THICK / 2, size + WALL_THICK * 2, WALL_THICK],
    [half + WALL_THICK / 2, 0, WALL_THICK, size],
    [-half - WALL_THICK / 2, 0, WALL_THICK, size],
  ];
  for (const [x, z, w, d] of walls) {
    const geo = new THREE.BoxGeometry(w, WALL_HEIGHT, d);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(x, WALL_HEIGHT / 2, z);
    scene.add(mesh);
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(w / 2, WALL_HEIGHT / 2, d / 2)
        .setTranslation(x, WALL_HEIGHT / 2, z),
    );
  }
}
