# 2026-11-30-cadeira-parada · revisão, volta 1 (2026-11-26)

## revisor-copy: REPROVADO (3)
1. **CTA sem destino confirmado:** botão "Link na bio" com ícone de WhatsApp, mas o STATUS.md não diz para onde vai o link da bio. BRAND/calendar pedem WhatsApp. → **Depende do Gabriel.**
2. Cena 4: "Quem procura dentista hoje começa no Google e no Instagram." afirmado como fato absoluto → qualificar ("muita gente…").
3. Cena 5: "A Nexora coloca sua clínica na frente…" soa como resultado garantido; legenda e site falam em trabalho de meio → "Nosso trabalho é colocar…".
Sugestões: "gratuito" repetido na cena 6; "te encontrando" mistura tratamento; calendar com 2 opções de enquete vs 3 na peça.

## revisor-visual: REPROVADO (4)
1. Reel.tsx: logo em `top: 190` (y 192–284) invade os 250 px do topo e corta no recorte 3:4 da capa → usar SAFE.story.top.
2. Pill com fonte 28 px (abaixo do mínimo ~34) em "AGENDA COM BURACOS?" e "ENQUETE".
3. Cena 3: "É" sozinho no fim da linha.
4. Cena 5: destaque "na frente" partido em duas linhas.
Sugestões: highlight da cena 4 com palavras soltas; "gratuito" repetido; ícone WhatsApp depende do destino do link.

## Estrategista (validação do item)
Manter. Unificar CTA (calendar diz WhatsApp, peça diz link na bio). 30/11/2026 = Cyber Monday e prazo da 1ª parcela do 13º.

---
# Volta 2 (2026-11-26)
- revisor-copy: REPROVADO (1). C2 e C3 resolvidas. Pendente só C1 (destino do "Link na bio": depende do Gabriel).
  Sugestões: "não é o atendimento" pode soar descaso com a recepção; "gratuito" repetido; alinhar calendar (3 opções de enquete).
- revisor-visual: REPROVADO (2). V1, V2 e V4 resolvidas. Pendente: linha terminando em palavra de 1 letra
  ("atendimento: é" na cena 3; "já procura o" na cena 5). Causa: WordReveal quebra em qualquer palavra; NBSP não ajuda
  porque split(/\s+/) inclui NBSP. Sugestões: logo a 11 px do recorte 3:4 na capa; "da / semana" na cena 2; perna do "j" fora da coluna.
