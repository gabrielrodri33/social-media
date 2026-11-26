#!/usr/bin/env node
// Narração com ElevenLabs: node scripts/tts.mjs <marca> <pasta-do-post>
// Lê brands/<marca>/voice.json e <post>/voice.txt; grava <post>/voice.mp3.
// Chave: header xi-api-key. No cloud o proxy injeta a credencial salva; localmente use ELEVENLABS_API_KEY.
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const [brand, postDir] = process.argv.slice(2);
if (!brand || !postDir) {
  console.error('Uso: node scripts/tts.mjs <marca> <pasta-do-post>');
  process.exit(1);
}
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const cfg = JSON.parse(await readFile(path.join(root, 'brands', brand, 'voice.json'), 'utf8'));
if (!cfg.voice_id || cfg.voice_id.startsWith('TODO')) {
  console.error(`brands/${brand}/voice.json ainda sem voice_id definido.`);
  process.exit(1);
}
const text = (await readFile(path.join(postDir, 'voice.txt'), 'utf8')).trim();
const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voice_id}?output_format=mp3_44100_128`, {
  method: 'POST',
  headers: {'xi-api-key': process.env.ELEVENLABS_API_KEY || 'injected-by-proxy', 'Content-Type': 'application/json'},
  body: JSON.stringify({text, model_id: cfg.model_id, language_code: cfg.language_code, voice_settings: cfg.voice_settings}),
});
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const out = path.join(postDir, 'voice.mp3');
await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log(`OK: ${out} (${text.length} caracteres)`);
