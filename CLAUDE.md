# social-media: memória e estúdio de 3 Instagrams

Este repositório é a **memória de trabalho** da gestão de 3 perfis de Instagram e o **estúdio** onde
os criativos são produzidos (Remotion para imagem e vídeo, ElevenLabs para voz).

| Marca | Pasta | Idioma público | Status |
|---|---|---|---|
| **Nexora** [@mkt.nexora](https://www.instagram.com/mkt.nexora/) (marketing para clínicas odontológicas, SP) | `brands/nexora/` | pt-BR | marca definida; logo no `brand-kit/` |
| **VELPORA** [@velporapet](https://www.instagram.com/velporapet/) (→ @velpora.usa) (pet lifestyle & care, e-commerce EUA) | `brands/velpora/` | **en-US, sempre** | briefing completo; logo oficial só em raster; loja e produtos chegando |
| **lelayer3d** [@le.layer3d](https://www.instagram.com/le.layer3d/) (impressão 3D, perfil do cunhado do Gabriel) | `brands/lelayer3d/` | pt-BR | sob encomenda (DM/WhatsApp); logo em 150 px; fotos chegando pelo Drive |

Conversa com o Gabriel: **português**. Copy pública da VELPORA: **inglês americano**.

**Arquivo final dos posts: Google Drive, pasta "Social Media"** (IDs e convenção em [`DRIVE.md`](DRIVE.md)).
Todo render entregue sobe para `Social Media/<Marca>/Posts/<AAAA-MM-DD-slug>/`.

**Frequência (revisada em 2026-11-26), igual para as 3 marcas:** 1 post de feed por dia (alternando reel e criativo/foto/carrossel) + 1 story por dia.
São 6 peças por dia no total (~42/semana). Produza em lote semanal a partir de templates reaproveitáveis.

## Antes de qualquer tarefa

1. Descubra a marca. **Nunca misture marcas** num mesmo criativo, legenda ou pasta.
2. Leia `brands/<marca>/BRAND.md` (regras e identidade) e `brands/<marca>/STATUS.md` (onde paramos,
   pendências, decisões). Para a VELPORA, o briefing integral está em `brands/velpora/briefing-original.md`.
3. Ao terminar, **atualize `STATUS.md`** da marca: o que foi feito, decisões, próximos passos.
   Esse arquivo é a memória entre sessões. Se não está lá, a próxima sessão não sabe.

## Estrutura

```
brands/<marca>/
  BRAND.md          identidade, tom, cores, regras proibidas (fonte da verdade da marca)
  STATUS.md         memória viva: pendências, decisões (com data), próximos passos
  calendar.md       calendário editorial (o que sai, quando, status)
  posts/AAAA-MM-DD-slug/   uma pasta por DIA (feed + story do dia)
    post.md         ficha do feed: frontmatter (status, format: feed|carousel|reel, composição) + legenda + roteiro
    props.json      props do template (carrossel: {slides: [...]}; reel: {scenes: [...]})
    story.md        ficha do story do dia (format: story) + como colocar a figurinha no app
    story.props.json
    voice.txt       (reel) narração: UMA LINHA POR CENA, mesma ordem de props.scenes
    voice.mp3, voice-timings.json   gerados por scripts/tts.mjs
  assets/           fotos e vídeos de entrada (originais enviados pelo Gabriel)
studio/             projeto Remotion único, templates por marca em studio/src/brands/<marca>/
scripts/            render-post.sh (→ render-post.mjs), tts.mjs (ElevenLabs), sync-nexora-brand.sh
templates/post.md   modelo da ficha de post
```

## Fluxo de um post

`idea` → `draft` (renderizado, aguardando aprovação) → `approved` → `published` (com link e data).
O status fica no frontmatter de `post.md` e no `calendar.md`. **Só marque `approved` quando o Gabriel aprovar.**

1. Crie a pasta a partir de `templates/post.md`.
2. Escolha um template (composição) em `studio/src/Root.tsx` ou crie um novo em `studio/src/brands/<marca>/`.
   ID da composição: `<Marca>-<Template>` (ex.: `Velpora-QuoteCard`).
3. Escreva `props.json` (e `story.props.json`), renderize: `scripts/render-post.sh brands/<marca>/posts/<dia>`
   (`--only=feed` ou `--only=story`). Carrossel sai um PNG por slide; reel sai MP4 + capa PNG.
4. **Confira os frames** (abra o PNG; em vídeo, extraia frames do início, meio e fim) antes de entregar.
5. Narração (reel): `node scripts/tts.mjs <marca> <dia>` gera `voice.mp3` + `voice-timings.json`; renderize de novo
   e as cenas passam a seguir o tempo da fala. Sem voz, o reel usa tempo de leitura.
6. Suba o render para o Drive (ver `DRIVE.md`), grave `drive_folder:` no `post.md` e atualize `calendar.md`.

## Remotion

- Tudo dentro de `studio/`: `npm install`, `npm run studio`, `npm run typecheck`.
- Remotion **compõe e anima**; ele não gera fotos. Fotos/vídeos reais entram por `assets/`.
- Formatos: use `studio/src/shared/formats.ts` (feed 1080×1440, story/reels 1080×1920) e as margens `SAFE`.
- Fontes vêm de `@fontsource/*` (npm), não de Google Fonts em runtime.
- **Em ambiente cloud do Claude Code**, use o Chromium instalado:
  `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
  (se mudar, procure em `/opt/pw-browsers/`). `scripts/render-post.sh` já detecta isso.
- Renders (`studio/out/`, `**/render/`) não vão para o git.

## Regras por marca (resumo; detalhes no BRAND.md)

**Nexora**
- Logo: só via `NexoraLogo` de `brands/nexora/brand-kit/react/NexoraLogo.tsx` (já reexportado em
  `studio/src/brands/nexora/brand.ts`). Nunca redesenhe, aproxime ou edite o logo nem o "N".
- `brands/nexora/brand-kit/` é **cópia somente-leitura** de `lp-nexora/nexora-brand/`. Não edite aqui.
  Para atualizar: `scripts/sync-nexora-brand.sh <caminho-do-lp-nexora>`.
- "Sem promessa milagrosa": não garanta pacientes, faturamento ou resultado. Sem antes e depois. Normas do CFO.
- Copy de referência: `content/site.ts` do repo `lp-nexora`.

**VELPORA**
- Toda copy pública em inglês americano (artes, legendas, Stories, narração).
- Logo: só existe a imagem de referência `brands/velpora/brand-kit/logo-e-destaques-referencia.webp` (raster).
  Não redesenhe nem vetorize "de olho". Não use o ® até haver registro concedido (ver BRAND.md).
- Não inventar reviews/depoimentos (regra da marca e regra da FTC dos EUA), não anunciar descontos inativos,
  prazos de entrega não confirmados, produtos não aprovados ou alegações de saúde sem comprovação.
- Não usar imagem que não corresponda ao produto vendido.

**lelayer3d**
- Só use fotos reais das impressões enviadas. Não invente peças, preços nem prazos.

## Voz (ElevenLabs)

- `scripts/tts.mjs` lê `brands/<marca>/voice.json` (voice_id, modelo, ajustes) e o `voice.txt` do post.
  Vozes escolhidas (2026-11-26): Nexora `F6z5r8W1ZxTsvUyVlvpG` (pt-BR), VELPORA `zfc8CJQpe8Kqyl0vvCzo` (en-US).
- A chave da API **nunca** vai para o repositório. No cloud, peça com a ferramenta de credencial
  (host `api.elevenlabs.io`, header `xi-api-key`); localmente, variável `ELEVENLABS_API_KEY`.
  Ambiente cloud próprio: **social-media** (criado em 2026-11-26). A chave entra em Network secrets desse ambiente.
- Voz realista gerada por IA: no Instagram, marque o rótulo "AI info" quando a política da Meta exigir.

## Verificação antes de commitar

`cd studio && npm run typecheck` e renderizar ao menos um frame de cada template alterado.
