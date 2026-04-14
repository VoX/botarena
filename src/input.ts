export interface PlayerInput {
  move: { x: number; y: number };
  aim: { x: number; y: number };
  shoot: boolean;
}

const state: PlayerInput[] = [
  { move: { x: 0, y: 0 }, aim: { x: 1, y: 0 }, shoot: false },
  { move: { x: 0, y: 0 }, aim: { x: 1, y: 0 }, shoot: false },
];

const keys = new Set<string>();
let arenaHalf = 20;

let mouseWorld = { x: 1, y: 0 };
let mouseDown = false;
let p1Pos: { x: number; y: number } | null = null;

export function initInput(arenaSize: number): void {
  arenaHalf = arenaSize / 2;

  addEventListener('keydown', e => {
    keys.add(e.code);
    if (e.code.startsWith('Arrow') || e.code.startsWith('Numpad')) e.preventDefault();
  });
  addEventListener('keyup', e => keys.delete(e.code));
  addEventListener('blur', () => keys.clear());

  addEventListener('mousemove', e => {
    const viewSize = 28;
    const aspect = innerWidth / innerHeight;
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = (e.clientY / innerHeight) * 2 - 1;
    mouseWorld.x = nx * viewSize * aspect;
    mouseWorld.y = ny * viewSize;
  });
  addEventListener('mousedown', e => { if (e.button === 0) mouseDown = true; });
  addEventListener('mouseup',   e => { if (e.button === 0) mouseDown = false; });

  addEventListener('contextmenu', e => e.preventDefault());
}

export function setPlayerPositions(p1: { x: number; y: number } | null, _p2: { x: number; y: number } | null) {
  p1Pos = p1;
}

function normalize(v: { x: number; y: number }): { x: number; y: number } {
  const len = Math.hypot(v.x, v.y);
  if (len < 1e-4) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function getInput(playerIdx: 0 | 1): PlayerInput {
  const s = state[playerIdx];

  if (playerIdx === 0) {
    const mx = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0);
    const my = (keys.has('KeyS') ? 1 : 0) - (keys.has('KeyW') ? 1 : 0);
    const moveN = normalize({ x: mx, y: my });
    s.move.x = moveN.x;
    s.move.y = moveN.y;

    if (p1Pos) {
      const ax = mouseWorld.x - p1Pos.x;
      const ay = mouseWorld.y - p1Pos.y;
      const aim = normalize({ x: ax, y: ay });
      if (aim.x !== 0 || aim.y !== 0) { s.aim.x = aim.x; s.aim.y = aim.y; }
    }
    s.shoot = mouseDown;
  } else {
    const mx = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0);
    const my = (keys.has('ArrowDown')  ? 1 : 0) - (keys.has('ArrowUp')   ? 1 : 0);
    const moveN = normalize({ x: mx, y: my });
    s.move.x = moveN.x;
    s.move.y = moveN.y;

    const ax = (keys.has('Numpad6') ? 1 : 0) - (keys.has('Numpad4') ? 1 : 0);
    const ay = (keys.has('Numpad2') ? 1 : 0) - (keys.has('Numpad8') ? 1 : 0);
    const aim = normalize({ x: ax, y: ay });
    if (aim.x !== 0 || aim.y !== 0) { s.aim.x = aim.x; s.aim.y = aim.y; }

    s.shoot = keys.has('NumpadEnter') || keys.has('Numpad0');
  }

  void arenaHalf;
  return s;
}
