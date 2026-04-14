import * as THREE from 'three';
import { initPhysics, stepPhysics } from './physics';
import { buildArena } from './arena';
import { initInput } from './input';
import { mountHud } from './hud';
import { initAudio } from './audio';

const ARENA = 40;

const app = document.getElementById('app')!;
const fpsEl = document.getElementById('fps')!;

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x101015);
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x101015, 40, 80);

const aspect = innerWidth / innerHeight;
const viewSize = 28;
const camera = new THREE.OrthographicCamera(
  -viewSize * aspect, viewSize * aspect,
  viewSize, -viewSize,
  0.1, 200,
);
camera.position.set(0, 50, 0);
camera.lookAt(0, 0, 0);

const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(20, 40, 10);
scene.add(sun);
scene.add(new THREE.AmbientLight(0x606080, 0.6));

await initPhysics();
buildArena(scene, ARENA);
initInput(ARENA);
mountHud();
void initAudio();

addEventListener('resize', () => {
  const a = innerWidth / innerHeight;
  camera.left = -viewSize * a;
  camera.right = viewSize * a;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();
let frames = 0;
let fpsAccum = 0;

function loop() {
  const dt = Math.min(clock.getDelta(), 0.1);
  stepPhysics(dt);

  renderer.render(scene, camera);

  frames++;
  fpsAccum += dt;
  if (fpsAccum >= 0.5) {
    fpsEl.textContent = `fps: ${Math.round(frames / fpsAccum)}`;
    frames = 0;
    fpsAccum = 0;
  }

  requestAnimationFrame(loop);
}
loop();
