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
- [ ] **30/11 refeito em 2026-11-26** (Gabriel achou o reel fraco): reel com 6 fotos Unsplash (sem rosto), véu navy, narração e
      trilha; + criativo estático 1080×1350 (`Nexora-PhotoCard`, arquivo `criativo.md`). Aguardando o Gabriel aprovar o
      visual ANTES de passar pelos revisores (decisão: revisão só depois do ok visual do Gabriel).
- [ ] **Licença ElevenLabs:** voz (Brian, premade) e trilha (sound-generation) gerados no plano GRATUITO, que não tem
      licença comercial. Para publicar: plano pago (libera também a voz Samuel, a preferida). Amostras de voz: Brian, Eric, Daniel.
- [x] 30/11 (cadeira-parada): bloqueio resolvido (link da bio → WhatsApp). Copy e visual **APROVADOS** em 2026-11-26;
      no Drive como RASCUNHO- (reel sem narração). Aguardando aprovação do Gabriel.
- [ ] Aplicar nos outros dias da semana o que foi corrigido em 30/11 (achado do revisor-copy): 02/12 legenda com
      "Chama no WhatsApp" → "Chame"; 04/12 e 06/12 botão "Link na bio" → WhatsApp explícito ("Chame no WhatsApp").
- [ ] Narração: conta ElevenLabs gratuita (402). Plano pago ou outra voz.
- [ ] **Drive fora do fluxo:** 01/12 subiu (30/11 já substituído pela versão aprovada) ao Drive (RASCUNHO-) ANTES da aprovação dos revisores. Manter como
      rascunho e substituir depois de aprovados. Daqui em diante: só sobe com APROVADO dos dois revisores.
- [ ] **Re-renderizar os feeds da semana 1 no padrão 1080×1350** (os carrosséis de 01/12 e 03/12 e o card de 05/12
      foram gerados em 1080×1440 antes do padrão; os templates já estão corrigidos). Reels e stories não mudam.
      No Drive, a substituir: 01/12 (carrossel em 1080×1440). 30/11 já está na versão aprovada. 02/12 a 06/12 não subiram:
      geração interrompida pelo Gabriel em 2026-11-26, aguardando ordem para continuar.
- [ ] Gabriel aprovar os 14 criativos da semana 1 (Drive, prefixo RASCUNHO-).
- [ ] Montar templates: reel com legenda na tela, carrossel educativo, card, story.
- [ ] Pilares de conteúdo da Nexora (não há briefing formal como o da VELPORA).
- [ ] Chave do ElevenLabs no ambiente cloud **social-media** (Network secrets, host api.elevenlabs.io, header xi-api-key).
      Depois: `node scripts/tts.mjs nexora <dia>` + render de novo nos 4 reels.

## Decisões
- 2026-11-26: modelos dos revisores validados contra a volta 1 do dia 30/11: revisor-copy em medium deixou passar a
  promessa "coloca sua clínica" → fica **opus/high**; revisor-visual em sonnet só pegou a pílula de 28 px depois do item
  "medir TODA linha de texto" no checklist → fica **sonnet/medium** com esse item.
- 2026-11-26: **o link da bio do @mkt.nexora leva ao WhatsApp** (Gabriel). Resolve a C1 do bloqueio de 30/11:
  CTA "Link na bio" + ícone de WhatsApp é coerente; o revisor-copy pediu deixar o WhatsApp explícito na copy.
- 2026-11-26: chave do ElevenLabs corrigida pelo Gabriel. Teste: **402 paid_plan_required**, a conta é gratuita e o plano
  gratuito não usa vozes da biblioteca pela API (a voz da Nexora `F6z5r8W1ZxTsvUyVlvpG` é de biblioteca). Gabriel decide:
  plano pago ou outra voz que a conta aceite. Reels seguem sem narração até lá.
- 2026-11-26: revisão enxuta (custo): revisor-visual roda quando um template muda + amostra semanal; copy de toda peça
  passa por check-post + revisor-copy; vários dias por rodada de revisor.
- 2026-11-26: criativos da Nexora produzidos aqui, no estúdio único.
- 2026-11-26: narração dos reels em pt-BR via ElevenLabs.
