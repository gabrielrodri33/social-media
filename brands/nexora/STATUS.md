# Nexora: status e memória

## Onde estamos (2026-11-26)
- Perfil @mkt.nexora. Gestão do Instagram feita só neste repositório.
- `lp-nexora/criativos/` foi **removido** do repo da LP (2026-11-26). O teste técnico `NexoraOdonto`
  continua no histórico git do lp-nexora, se precisar consultar.
- Kit do logo copiado de `lp-nexora/nexora-brand` (somente leitura).
- Templates: `Nexora-Reel` (1080×1920, cenas com texto animado, sincroniza com a voz), `Nexora-Slide` (carrossel 1080×1350),
  `Nexora-StatementCard` (card 1080×1350), `Nexora-Story` (1080×1920 com área livre para figurinha).
- Semana 1 (30/11 a 06/12) **produzida** em `posts/`: 4 reels, 2 carrosséis, 1 card, 7 stories. Status: draft.
  Reels renderizados **sem narração** (chave do ElevenLabs ainda não configurada). Voz escolhida: `F6z5r8W1ZxTsvUyVlvpG`.

## Frequência (decidida em 2026-11-26)
1 post de feed por dia (alternando reel e criativo/foto/carrossel) + 1 story por dia.
(Revisada em 2026-11-26: antes era 2 feed + 1 reel + 2 stories por dia para Nexora e VELPORA.)

## Pendências
- [ ] **30/11 em BLOQUEIO DE REVISÃO** (teste da equipe de agentes, 2026-11-26): visual APROVADO; copy REPROVADO por
      C1 = destino do "Link na bio" do @mkt.nexora não registrado (botão tem ícone de WhatsApp). **Gabriel decide**:
      bio → WhatsApp, bio → LP, ou CTA direto "Chama no WhatsApp". A decisão vale para os 7 dias (todos usam "Link na bio").
      Pendentes também (guardião): tirar "gratuito" repetido na cena 6; alinhar opções da enquete no calendar × story.md.
- [ ] **Drive fora do fluxo:** 30/11 e 01/12 subiram ao Drive (RASCUNHO-) ANTES da aprovação dos revisores. Manter como
      rascunho e substituir depois de aprovados. Daqui em diante: só sobe com APROVADO dos dois revisores.
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
- 2026-11-26: **o link da bio do @mkt.nexora leva ao WhatsApp** (Gabriel). Resolve a C1 do bloqueio de 30/11:
  CTA "Link na bio" + ícone de WhatsApp é coerente; o revisor-copy pediu deixar o WhatsApp explícito na copy.
- 2026-11-26: chave do ElevenLabs corrigida pelo Gabriel no ambiente social-media (a testar na próxima narração).
- 2026-11-26: revisão enxuta (custo): revisor-visual roda quando um template muda + amostra semanal; copy de toda peça
  passa por check-post + revisor-copy; vários dias por rodada de revisor.
- 2026-11-26: criativos da Nexora produzidos aqui, no estúdio único.
- 2026-11-26: narração dos reels em pt-BR via ElevenLabs.
