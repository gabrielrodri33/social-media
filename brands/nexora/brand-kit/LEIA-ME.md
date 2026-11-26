# Marca Nexora: logo em código

**Fonte única do logo.** Nenhum criativo, site ou vídeo redesenha o "N".
Todo mundo importa daqui.

## Arquivos
| Arquivo | Uso |
|---|---|
| `svg/nexora-simbolo.svg` | Só o N, para fundo claro |
| `svg/nexora-simbolo-branco.svg` | Só o N, para fundo escuro |
| `svg/nexora-logo.svg` | N + NEXORA, para fundo claro |
| `svg/nexora-logo-branco.svg` | N + NEXORA, para fundo escuro |
| `svg/nexora-logo-slogan.svg` | Completo, com slogan |
| `png/*.png` | Mesmas versões em PNG transparente (2000px de altura), para Canva, Figma e redes |
| `react/NexoraLogo.tsx` | Componente para Remotion e sites React: `<NexoraLogo variant="logo" theme="dark" height={150} />` |

## Cores oficiais (medidas no arquivo original)
- Navy: `#0F2848`
- Ciano (gradiente vertical): `#04E1EF` → `#04AFD6`
- Cinza do slogan: `#5A6573`

## Regras
1. **Não edite os paths à mão.** Os arquivos são gerados por `fonte/build.py` (a partir de `fonte/paths.json`; o PNG de origem está em `fonte/logo-original.png`).
2. A folha ciano **nunca muda de cor**: nem em fundo escuro, nem em versão monocromática.
3. **Não use sobre fundo ciano ou azul-claro**: a folha desaparece.
4. Não distorça (sempre escala proporcional), não gire, não aplique sombra nem contorno.

## Fidelidade
Vetorizado a partir de um PNG de 640px e comparado pixel a pixel com o original:
símbolo 99,4% · NEXORA 98,5% · slogan ~91% (letras finas, limite da resolução de origem).
Se existir o arquivo vetorial original (.ai, .svg, .pdf ou .fig) do designer, **ele substitui este**:
rode o mesmo processo de exportação a partir dele.
