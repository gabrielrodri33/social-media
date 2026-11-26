# Regras comuns dos agentes (social-media)

Todos os agentes de `.claude/agents/` leem este arquivo antes de qualquer tarefa. Ele fica fora de
`.claude/agents/` de propósito: não é um agente.

## 1. Antes de qualquer tarefa
1. Ler `CLAUDE.md` (raiz), `brands/<marca>/BRAND.md`, `brands/<marca>/STATUS.md` e `brands/<marca>/compliance.json`.
2. VELPORA: ler também `brands/velpora/briefing-original.md`.
3. Nexora: copy de referência em `content/site.ts` do repositório `lp-nexora` (normalmente em `../lp-nexora`).
4. Descobrir a marca pelo caminho (`brands/<marca>/...`). Uma tarefa = uma marca.

## 2. Proibições absolutas
- Nunca misturar marcas (copy, cores, logo, pasta, hashtag).
- Nunca inventar preço, prazo, review, depoimento, número de resultado, produto ou estoque.
  Só vale o que estiver escrito em `BRAND.md` ou `STATUS.md`.
- Nenhum agente marca `approved` ou `published`. Só o Gabriel.
- Nenhum agente sobe nada ao Google Drive: quem sobe é a sessão principal (ver `DRIVE.md`).

## 3. Estrutura do repositório (como está hoje)

### Marcas
| Marca | Idioma público | Templates disponíveis (`studio/src/Root.tsx`) |
|---|---|---|
| nexora | pt-BR | `Nexora-Reel`, `Nexora-Slide` (carrossel), `Nexora-StatementCard` (card), `Nexora-Story` |
| velpora | en-US | `Velpora-QuoteCard` (os outros ainda não existem: reel, carrossel e story precisam ser criados) |
| lelayer3d | pt-BR | nenhum ainda (criar em `studio/src/brands/lelayer3d/`) |

### Pasta de um dia: `brands/<marca>/posts/AAAA-MM-DD-slug/`
Uma pasta por **dia**, com o feed e o story daquele dia:
| Arquivo | O quê |
|---|---|
| `post.md` | ficha do feed: frontmatter (`brand`, `date`, `status`, `format: feed|carousel|reel`, `pillar`, `composition`, `frame`, `drive_folder`, `published_url`) + Objetivo, Copy da arte, Legenda, Hashtags, Roteiro, Notas de aprovação, Revisões, Resultado |
| `props.json` | props do template. Carrossel: `{"slides": [{kind, eyebrow?, title, highlight?, body?, number?, button?}]}`. Reel: `{"scenes": [{text, highlight?, eyebrow?, sub?, button?}]}` |
| `story.md` + `story.props.json` | story do dia (`format: story`, `composition: <Marca>-Story`) + "## Como publicar" (qual figurinha colocar no app) |
| `voice.txt` | reel: narração, **uma linha por cena**, mesma ordem de `props.scenes` |
| `voice.mp3`, `voice-timings.json` | gerados por `scripts/tts.mjs` (ElevenLabs, com tempo de cada cena) |
| `render/` | saída (fora do git): PNGs, MP4, `*-capa.png` do reel, `*-story.png`, `LEGENDA.txt` |

### Formatos (padrão de 2026-11-26) — `studio/src/shared/formats.ts`
- Feed e carrossel: **1080×1350**. Todo texto/logo dentro do **quadrado central 1080×1080** (y 135 a 1215),
  margem lateral ≥ 90 px. As faixas de 135 px em cima e embaixo recebem só fundo.
- Story e Reels: **1080×1920**. Livre: 250 px no topo, 340 px na base; no reel, ~170 px à direita (botões do app).
- No código: `FORMATS`, `SAFE`, `FEED_SQUARE`. Nunca números soltos.
- **Não colocar campos opcionais em `defaultProps`** no Root.tsx: o Remotion mistura com as props do post e o campo vaza
  (já aconteceu: o rótulo "GOOGLE MAPS" apareceu em slides de outro carrossel).

### Scripts
| Comando | Faz |
|---|---|
| `scripts/render-post.sh <dia> [--only=feed\|story]` | renderiza: carrossel = 1 PNG por slide; reel = MP4 + capa; story = PNG; gera `render/LEGENDA.txt`. Reel com `voice.mp3` sai narrado e sincronizado |
| `node scripts/check-post.mjs <dia>` | termos de `compliance.json`, frontmatter, voz × cenas, legenda ≤ 2.200, hashtags. Exit 1 = reprovado |
| `node scripts/frames.mjs <dia>` | lista stills com dimensão e extrai frames do reel (início, 1 por cena, fim) em `studio/out/frames/<dia>/` |
| `node scripts/tts.mjs <marca> <dia>` | narração ElevenLabs (voz em `brands/<marca>/voice.json`) |
| `node scripts/unsplash.mjs search "<termos>"` / `get <id> <marca>` | fotos de banco com crédito em `assets/unsplash/CREDITS.json` |
| `cd studio && npm run typecheck` | obrigatório depois de mexer em template |

### Fotos
- lelayer3d: **só fotos reais** das peças (`assets/`, chegam pela pasta "Fotos recebidas" do Drive).
- VELPORA: Unsplash só para lifestyle; nunca para representar produto vendido.
- Unsplash em qualquer marca: **sem rosto identificável** e sem logo de terceiro.

### Logo
- Nexora: só `NexoraLogo` (reexportado em `studio/src/brands/nexora/brand.ts`). Nunca redesenhar nem editar `brand-kit/`.
- VELPORA: só existe imagem de referência raster (`brands/velpora/brand-kit/`). Não redesenhar nem vetorizar "de olho". Sem ®.
- lelayer3d: só a foto de perfil de 150 px. Não usar em criativo até chegar o arquivo em alta.

## 4. O que reprova e o que não reprova (decisão do Gabriel, 2026-11-26)

**Quem julga se a peça está boa é o Gabriel** (ele aprova o visual antes da revisão). O revisor é o guarda das regras:
só reprova o que daria problema de verdade se fosse ao ar. O resto vira AJUSTE ou SUGESTÃO e **não reprova**.

**BLOQUEANTE (reprova):**
- Promessa/garantia de resultado, número, preço, prazo ou depoimento inventado; termo PROIBIDO do compliance.json.
- Regra legal/de plataforma: CFO (Nexora), FTC/alegação de saúde (VELPORA), licença (foto, voz, música sem uso comercial).
- Rosto identificável, marca/logo/interface de terceiro legível, imagem que não corresponde ao produto.
- Logo da marca errado, distorcido ou sobre fundo proibido.
- Texto cortado, fora da área segura, ilegível (< 34 px ou contraste ruim) ou formato errado.
- Erro de português visível na arte ou na legenda; CTA sem destino real.

**AJUSTE (não reprova; a sessão principal corrige sem nova rodada de revisão):**
- Ficha/calendário/STATUS desatualizados ou divergentes (texto que está na arte e não está no post.md, enquete diferente no calendar etc.).
- Quebra de linha feia, palavra curta no fim da linha, pequenas inconsistências de tratamento (te/você), repetição de palavra.

**SUGESTÃO:** gosto, melhoria opcional (máx. 3).

## 5. Formato fixo de relatório (todo revisor)
```
VEREDITO: APROVADO | REPROVADO
CHECKLIST:
- ✅|❌ <item> — evidência: "<trecho exato>" | frame <nome/tempo> | <arquivo>
CORREÇÕES OBRIGATÓRIAS (só BLOQUEANTES):
1. <arquivo/peça> — <o que mudar, objetivo>
(vazio se APROVADO)
AJUSTES (não bloqueiam; a sessão principal aplica):
- <arquivo> — <o que acertar>
SUGESTÕES (opcionais, no máximo 3):
- ...
```
- Todo item do checklist precisa de evidência concreta. Item sem evidência conta como ❌.
- Proibido: "parece bom", "no geral ok", "sem problemas aparentes", aprovar sem checklist completo.
- Marque ❌ BLOQUEANTE, ⚠️ AJUSTE ou ✅ em cada item. Só ❌ BLOQUEANTE reprova.
- Na dúvida sobre uma regra **bloqueante**, REPROVAR e escrever a dúvida. Na dúvida sobre o resto, AJUSTE ou SUGESTÃO.
- APROVADO com AJUSTES é normal e esperado.
- Revisores **não editam e não escrevem arquivos**. O relatório volta como resposta; a sessão principal registra.
