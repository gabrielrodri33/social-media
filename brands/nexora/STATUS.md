# Nexora: status e memória

## Onde estamos (2026-11-26)
- Perfil @mkt.nexora. Gestão do Instagram feita só neste repositório.
- `lp-nexora/criativos/` foi **removido** do repo da LP (2026-11-26). O teste técnico `NexoraOdonto`
  continua no histórico git do lp-nexora, se precisar consultar.
- Kit do logo copiado de `lp-nexora/nexora-brand` (somente leitura).
- Templates: `Nexora-Reel` (1080×1920, cenas com texto animado, sincroniza com a voz), `Nexora-Slide` (carrossel 1080×1440),
  `Nexora-StatementCard` (card 1080×1440), `Nexora-Story` (1080×1920 com área livre para figurinha).
- Semana 1 (30/11 a 06/12) **produzida** em `posts/`: 4 reels, 2 carrosséis, 1 card, 7 stories. Status: draft.
  Reels renderizados **sem narração** (chave do ElevenLabs ainda não configurada). Voz escolhida: `F6z5r8W1ZxTsvUyVlvpG`.

## Frequência (decidida em 2026-11-26)
1 post de feed por dia (alternando reel e criativo/foto/carrossel) + 1 story por dia.
(Revisada em 2026-11-26: antes era 2 feed + 1 reel + 2 stories por dia para Nexora e VELPORA.)

## Pendências
- [ ] **Re-renderizar os feeds da semana 1 no padrão 1080×1350** (os carrosséis de 01/12 e 03/12 e o card de 05/12
      foram gerados em 1080×1440 antes do padrão; os templates já estão corrigidos). Reels e stories não mudam.
      No Drive já estão (em 1080×1440, a substituir): 30/11 completo e 01/12 completo. 02/12 a 06/12 não subiram:
      geração interrompida pelo Gabriel em 2026-11-26, aguardando ordem para continuar.
- [ ] Gabriel aprovar os 14 criativos da semana 1 (Drive, prefixo RASCUNHO-).
- [ ] Montar templates: reel com legenda na tela, carrossel educativo, card, story.
- [ ] Pilares de conteúdo da Nexora (não há briefing formal como o da VELPORA).
- [ ] Chave do ElevenLabs no ambiente cloud **social-media** (Network secrets, host api.elevenlabs.io, header xi-api-key).
      Depois: `node scripts/tts.mjs nexora <dia>` + render de novo nos 4 reels.

## Decisões
- 2026-11-26: criativos da Nexora produzidos aqui, no estúdio único.
- 2026-11-26: narração dos reels em pt-BR via ElevenLabs.
