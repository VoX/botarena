type SfxName = 'shoot' | 'hit' | 'death' | 'spawn' | 'pickup';

const cache = new Map<SfxName, HTMLAudioElement>();
let masterVol = 0.6;

const MANIFEST: Record<SfxName, string> = {
  shoot:  'audio/shoot.ogg',
  hit:    'audio/hit.ogg',
  death:  'audio/death.ogg',
  spawn:  'audio/spawn.ogg',
  pickup: 'audio/pickup.ogg',
};

export async function initAudio(): Promise<void> {
  const stored = localStorage.getItem('botarena:vol');
  if (stored) masterVol = Math.max(0, Math.min(1, parseFloat(stored)));

  await Promise.all(Object.entries(MANIFEST).map(async ([name, url]) => {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        audio.addEventListener('canplaythrough', done, { once: true });
        audio.addEventListener('error', done, { once: true });
        setTimeout(done, 2000);
      });
      cache.set(name as SfxName, audio);
    } catch {
      // best-effort — if asset missing, play() becomes no-op for this sfx
    }
  }));
}

export function play(name: SfxName): void {
  const src = cache.get(name);
  if (!src) return;
  const inst = src.cloneNode() as HTMLAudioElement;
  inst.volume = masterVol * (0.9 + Math.random() * 0.2);
  inst.playbackRate = 0.93 + Math.random() * 0.14;
  inst.play().catch(() => { /* user gesture not yet granted */ });
}

export function setMasterVolume(v: number): void {
  masterVol = Math.max(0, Math.min(1, v));
  localStorage.setItem('botarena:vol', masterVol.toString());
}

export function getMasterVolume(): number { return masterVol; }
