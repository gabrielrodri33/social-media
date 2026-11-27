---
description: Vídeo animado de bonecos de palito (plugin GrowKaz) para uma marca, com voz ElevenLabs, trilha/SFX gerados, 3D opcional e logo oficial no fim. Uso: /video-animado <marca> <slug> [roteiro ou briefing]
argument-hint: <marca> <slug> [roteiro/briefing]
---

Você é a sessão principal. Argumentos: `$ARGUMENTS` (1º marca, 2º slug do projeto, resto = roteiro ou briefing).
Setup validado em 2026-11-27 com `nexora-cadeira-vazia` (Gabriel aprovou: "ficou foda"). Siga na ordem.

## 0. Contexto
- `CLAUDE.md` (seção Plugins), `brands/<marca>/BRAND.md`, `STATUS.md`, `compliance.json`.
- Plugin: `plugins/growkaz-stickman/skills/make-2d-video/references/` (style-bible, engine-api, sound-design, render-qc).
- Exemplo pronto para copiar cenários e cenas: `growkaz-stickman-studio/projects/nexora-cadeira-vazia/scenes/`
  (`sets/clinic.js` consultório com cadeira odontológica, `sets/street.js` rua do bairro, celular genérico em `shots/02_street.js`,
  blueprint/agenda/relatório em `shots/03_info.js`, bairro 3D em `shots/04_bairro3d.js`).

## 1. Roteiro
- Se veio briefing, escreva o roteiro (20–30 s, uma frase por linha) com copy de `content/site.ts` (Nexora). Sem número, preço,
  prazo ou resultado que não esteja em BRAND.md/STATUS.md. Mostre ao Gabriel antes de gastar voz.
- Rode `node scripts/check-post.mjs` mentalmente: termos de `compliance.json` valem para o roteiro e para todo texto na tela.

## 2. Voz com tempo por palavra (sem Whisper)
```bash
node scripts/animacao-voz.mjs <marca> <roteiro.txt> <pasta-tmp> --tempo=1.15
cd growkaz-stickman-studio
python3 tools/new_project.py --name <slug> --voice <pasta-tmp>/voice.mp3 --script <pasta-tmp>/script.json --aspect 9:16 --resolution 1080p --title "<Título>" --captions --style nexora
python3 tools/parse_script.py --project projects/<slug> --script projects/<slug>/input/script.json
python3 tools/beats.py --project projects/<slug>
```
- `--tempo=1.15` deixou o Eric no ritmo certo. Estilo `nexora` (navy + ciano) só para a Nexora; outras marcas: criar estilo próprio em `engine/styles.js`.

## 3. Cenas
- Reescreva `story/shots.json` (13 cenas em ~28 s funcionou bem), `scenes/cast.js`, `scenes/sets/*.js`, `scenes/shots/*.js`.
- `wordTime()` ignora acentos: use o prefixo sem acento (`'pgina'` para "página").
- Regras de marca dentro do motor: **nenhum logo desenhado** (nem de terceiro: Google, WhatsApp, Instagram viram ícones genéricos
  e texto); nada de número inventado (relatório = barras sem valores); topo livre na última cena para o logo.
- Conferir: `CHROMIUM_PATH=/opt/pw-browsers/chromium node render.mjs --project projects/<slug> --sheet --scale 0.5` e abrir o PNG.
  Corrigir, renderizar `--stills` das cenas mexidas. Opcional: grid de estilos `--styles nexora,emerald,arctic --at t1,t2,t3`.

## 4. Som
- Trilha por trecho em `shots.json` → `music`; SFX por cena (`sfx`), ambiente (`amb`).
- **Volumes (feedback do Gabriel, 2026-11-27: trilha e efeitos brigavam com a voz):** padrão novo música −23 dB e SFX −14 dB
  (já em `new_project.py`); ganho de cada cue entre −14 e −18; nada de efeito forte em cima de palavra importante.

## 5. Render e entrega
```bash
CHROMIUM_PATH=/opt/pw-browsers/chromium node render.mjs --project projects/<slug> --format jpeg   # ~1 min p/ 30 s
python3 audio/mix.py --project projects/<slug>
cd .. && scripts/animacao-finalizar.sh <slug> <segundo-em-que-entra-o-logo>
```
- Conferir: frames do final (ffmpeg, 1 por cena), duração, `-14 LUFS`, e **ouvir o equilíbrio voz × trilha × efeitos**.
- Mandar o `-final.mp4` ao Gabriel. Drive (`DRIVE.md`): pasta `Posts/AAAA-MM-DD-<slug>/`, arquivo `RASCUNHO-…`.
  Acima de ~3 MB o upload por aqui falha: perguntar se manda o `-drive.mp4` (recomprimido) ou se ele sobe o original.
- Atualizar `brands/<marca>/STATUS.md` e `DRIVE.md`. Commit sem `build/` e `out/` (já no .gitignore).

## Pendências que valem para todo vídeo narrado
- Voz do plano gratuito ElevenLabs = sem licença comercial. Publicar só com plano pago. Marcar "AI info" no Instagram.
