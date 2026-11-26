---
description: Produz e revisa UM dia de post de uma marca seguindo o fluxo de agentes (criador → check-post → revisores → Drive). Uso: /produzir-dia <marca> <AAAA-MM-DD-slug>
argument-hint: <marca> <AAAA-MM-DD-slug> [o que mudar]
---

Você é a **sessão principal** orquestrando a produção de um dia. Argumentos: `$ARGUMENTS`
(1º = marca: nexora | velpora | lelayer3d; 2º = pasta do dia em `brands/<marca>/posts/`; o resto = instruções extras).

Siga os passos NA ORDEM. Não pule nenhum. Não faça você mesmo o trabalho de um agente.

## 0. Contexto
- Leia `CLAUDE.md` (seção "Operação de agentes"), `.claude/regras-agentes.md`, `brands/<marca>/STATUS.md`.
- Se o item do dia não estiver aprovado no `calendar.md` (Gabriel aprovou o plano), PARE e pergunte.
- Se o `post.md` tiver `## Bloqueio de revisão` não resolvido, PARE e mostre o bloqueio ao Gabriel.

## 0b. Qualidade primeiro — Gabriel
- Peça nova ou template novo: mostre ao Gabriel (frames/PNG) e só siga para revisão depois do ok visual dele.
  Os revisores não julgam se está bonito; isso é dele.

## 1. Produção — agente `criador`
- Chame o agente `criador` com: marca, pasta do dia, instruções extras do Gabriel e, se houver, as CORREÇÕES OBRIGATÓRIAS
  pendentes (texto literal do relatório). Reel com narração: o criador roda `scripts/tts.mjs` antes de renderizar.
- Ao voltar: rode você mesmo `node scripts/check-post.mjs brands/<marca>/posts/<dia>`. Se FALHOU, volte ao criador.

## 2. Revisão — `revisor-copy` e `revisor-visual` EM PARALELO
- Chame os dois na mesma mensagem, cada um com a pasta do dia. Não diga a eles o que procurar.
- Política enxuta (STATUS da Nexora, 2026-11-26): o `revisor-visual` é obrigatório quando um template mudou, quando o dia é
  novo, ou quando mudou texto da arte. Se só mudou legenda/hashtags, pode pular o visual: registre o motivo.
- Escreva no `post.md`, seção `## Revisões`, uma linha por revisor: `AAAA-MM-DD · <agente> · <VEREDITO> · <nº>`.
- Salve os relatórios completos em `brands/<marca>/reviews/<dia>-voltaN.md`.

## 2b. AJUSTES
- AJUSTES dos relatórios (ficha, calendário, quebra de linha etc.) você aplica direto (ou pede ao criador) **sem nova rodada de revisão**.

## 3. Correções (se algum REPROVADO por BLOQUEANTE)
- Volte ao `criador` SÓ com as CORREÇÕES OBRIGATÓRIAS (sem sugestões). Depois, passo 1 (check-post) e passo 2 de novo.
- **Máximo 2 voltas de correção.** Na 3ª reprovação: escreva `## Bloqueio de revisão` no `post.md` com os pontos,
  registre no `STATUS.md` e PARE para o Gabriel decidir.
- Correção que depende de informação que só o Gabriel tem (destino de link, preço, prazo): não mande ao criador; vá direto
  ao bloqueio e pergunte.

## 4. Drive — SÓ com APROVADO dos dois revisores
- **Proibido subir antes.** Confira na seção `## Revisões` que a última linha de cada revisor é APROVADO.
- Siga `DRIVE.md`: pasta do dia em `Social Media/<Marca>/Posts/` (procure antes de criar); suba os arquivos de `render/`
  com prefixo `RASCUNHO-` (e `LEGENDA.txt`). Se já houver rascunhos antigos do mesmo dia, mova os antigos para a lixeira
  (só arquivos criados por nós, `canTrash: true`).
- Grave `drive_folder:` no `post.md`. Status continua `draft`.

## 5. Fechamento
- Atualize `STATUS.md` e `calendar.md` da marca (status do dia, pendências).
- Commit e push.
- Responda ao Gabriel com: o que mudou, vereditos (com nº de voltas), o que está no Drive e o que depende dele.
- Nunca marque `approved` nem `published`.
