// Everything is saved in the browser's localStorage on this device.
import { DEFAULT_CATS } from './config.js';
import { makeSample } from './tasks.js';

const KEY = 'natalies-calendar-v1';
const LEGACY_KEY = 'crown-calendar-v1'; // used by the first demo; read once so nothing is lost

function read(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

export function loadState() {
  for (const k of [KEY, LEGACY_KEY]) {
    try {
      const raw = read(k);
      if (!raw) continue;
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.tasks)) {
        const cats = Array.isArray(s.cats) && s.cats.length ? s.cats : DEFAULT_CATS; // older saves had no categories
        return { tasks: s.tasks, crowns: s.crowns || {}, cats };
      }
    } catch (e) { /* bad data: try the next key */ }
  }
  return { ...makeSample(), cats: DEFAULT_CATS };
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

export function loadPref(name, fallback) {
  return read(`${KEY}:${name}`) || read(`${LEGACY_KEY}:${name}`) || fallback;
}

export function savePref(name, value) {
  try { localStorage.setItem(`${KEY}:${name}`, value); } catch (e) { /* ignore */ }
}
