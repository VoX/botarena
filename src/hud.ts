let hp1 = 100, hp2 = 100, score = 0;
let gameoverEl: HTMLElement | null = null;

const css = `
#hud-row { position: fixed; top: 6px; right: 8px; display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: #ddd; text-align: right; }
.hud-hp  { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
.hud-hp .label { font-weight: bold; }
.hud-hp .bar { width: 120px; height: 8px; background: #2a2a2a; border: 1px solid #444; position: relative; }
.hud-hp .fill { position: absolute; top: 0; left: 0; height: 100%; background: #4f4; transition: width 0.1s linear; }
.hud-hp.p1 .label { color: #4af; }
.hud-hp.p1 .fill  { background: #4af; }
.hud-hp.p2 .label { color: #fa4; }
.hud-hp.p2 .fill  { background: #fa4; }
#hud-score { font-size: 28px; font-weight: bold; color: #fff; text-shadow: 0 2px 4px #000; }
#hud-gameover { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; background: rgba(10,10,10,0.85); color: #fff; font-size: 32px; pointer-events: none; }
#hud-gameover.hidden { display: none; }
#hud-gameover .score { font-size: 48px; color: #fa4; }
#hud-gameover .hint { font-size: 14px; color: #aaa; }
`;

export function mountHud(): void {
  const host = document.getElementById('hud')!;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  host.innerHTML = `
    <div id="hud-row">
      <div id="hud-score">0</div>
      <div class="hud-hp p1"><span class="label">P1</span><div class="bar"><div class="fill" style="width:100%"></div></div></div>
      <div class="hud-hp p2"><span class="label">P2</span><div class="bar"><div class="fill" style="width:100%"></div></div></div>
    </div>
    <div id="hud-gameover" class="hidden">
      <div>GAME OVER</div>
      <div class="score">0</div>
      <div class="hint">press R to restart</div>
    </div>
  `;
  gameoverEl = document.getElementById('hud-gameover');
}

export function setHP(playerIdx: 0 | 1, value: number): void {
  const v = Math.max(0, Math.min(100, value));
  if (playerIdx === 0) hp1 = v; else hp2 = v;
  const el = document.querySelector(`.hud-hp.p${playerIdx + 1} .fill`) as HTMLElement | null;
  if (el) el.style.width = `${v}%`;
}

export function setScore(n: number): void {
  score = n;
  const el = document.getElementById('hud-score');
  if (el) el.textContent = String(n);
}

export function showGameover(finalScore: number): void {
  if (!gameoverEl) return;
  gameoverEl.classList.remove('hidden');
  const s = gameoverEl.querySelector('.score') as HTMLElement | null;
  if (s) s.textContent = String(finalScore);
}

export function hideGameover(): void {
  if (!gameoverEl) return;
  gameoverEl.classList.add('hidden');
}

export function getHudState() { return { hp1, hp2, score }; }
