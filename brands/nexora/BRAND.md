# Nexora: regras da marca (resumo operacional)

**O quê:** marketing para clínicas odontológicas em São Paulo (Google Ads, landing page, social media, Google Meu Negócio).
**Público do Instagram:** donos e donas de clínica odontológica. **Idioma:** pt-BR.
**Fontes da verdade (repo `lp-nexora`):** copy em `content/site.ts`, regras em `CLAUDE.md`, WhatsApp em `lib/config.ts`.

## Posicionamento
"**Sem promessa milagrosa**." Foco 100% em odontologia · contas no nome da clínica · relatório mensal claro.
- Nunca garantir número de pacientes, faturamento ou resultado. A frase "maior faturamento" do teste técnico
  antigo (`lp-nexora/criativos/src/NexoraOdonto.tsx`) **contradiz** isso: não reaproveitar.
- Sem antes e depois. Respeitar as normas de publicidade do CFO.
- CTA padrão: WhatsApp.

## Logo (regras obrigatórias, herdadas do lp-nexora)
1. Nunca desenhar, recriar, aproximar ou "melhorar" o logo nem o "N". Em Remotion: `NexoraLogo`
   (reexportado em `studio/src/brands/nexora/brand.ts`). Fora do React: `brand-kit/svg/` ou `brand-kit/png/`.
   variant: `symbol` | `logo` | `slogan` · theme: `light` (navy, fundo claro) | `dark` (branco, fundo escuro).
2. `brand-kit/` é cópia somente-leitura de `lp-nexora/nexora-brand/` (commit em `brand-kit/SOURCE_COMMIT`).
   Não editar aqui; atualizar com `scripts/sync-nexora-brand.sh`.
3. A folha ciano do "N" nunca muda de cor. Nunca sobre fundo ciano/azul-claro.
4. Sem distorcer, girar, sombra, contorno ou efeito. Não existe versão horizontal oficial.

## Cores dos criativos
navy `#0B2A4F` (fundo escuro dos criativos `#071a33`), cyan `#00C8E8`, sky `#5BB8E8`, ice `#EAF4FB`.
Fontes: Inter (texto) e Montserrat (títulos), como na LP.

## Formatos
Feed 4:5 (1080×1350) foi o usado até agora; pode migrar para 1080×1440. Stories/Reels 1080×1920.
