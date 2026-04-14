import RAPIER from '@dimforge/rapier3d-compat';

export let world: RAPIER.World;

const FIXED_DT = 1 / 60;
let accumulator = 0;

export async function initPhysics(): Promise<void> {
  await RAPIER.init();
  world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = FIXED_DT;
}

export function stepPhysics(dt: number): void {
  accumulator += dt;
  while (accumulator >= FIXED_DT) {
    world.step();
    accumulator -= FIXED_DT;
  }
}
