# TECHERS · Diagnóstico de Perfil

Formulário inteligente que identifica o perfil de um aluno (5–17 anos) e recomenda,
de forma **determinística** (sem IA generativa em tempo real), qual curso da TECHERS
tem maior afinidade com esse perfil — respeitando rigorosamente as regras de idade.

## Instalação

```bash
npm install
```

## Execução local

```bash
npm run dev
```

Abra o endereço exibido no terminal (geralmente `http://localhost:5173`).

## Testes automáticos

```bash
npm test
```

Executa os 8 perfis fictícios de `src/tests/sampleProfiles.ts` e checa, para várias
idades, que nenhuma recomendação "disponível agora" viola as regras de idade.

## Deploy na Vercel

1. Suba o projeto para um repositório Git.
2. Na Vercel, clique em **New Project** e importe o repositório.
3. Framework preset: **Vite**. Build command: `npm run build`. Output dir: `dist`.
4. Deploy — não é necessário nenhum servidor, banco de dados ou variável de ambiente.

Não há coleta de dados: as respostas do formulário existem apenas na memória do
navegador durante a sessão. Nenhum tracker, analytics ou pixel é utilizado.

---

## Como funciona o algoritmo

```
Resposta (alternativa escolhida)
   ↓
Dimensões de perfil (StudentProfile, ~27 dimensões internas)
   ↓
Pesos da resposta (cada alternativa soma pontos a 1+ dimensões)
   ↓
Distintividade por dimensão (dimensões raras entre os cursos pesam mais —
                              ver nota abaixo)
   ↓
Pontuação de cada curso (produto escalar perfil × pesos efetivos do curso)
   ↓
Normalização (0–100%, usando o máximo REALMENTE alcançável para aquele curso —
               ver nota abaixo)
   ↓
Afinidade %
   ↓
Verificação de idade (afinidade ≠ elegibilidade)
   ↓
Ranking (afinidade pura × ranking elegível para a idade atual)
```

**Nota sobre normalização:** o máximo de cada curso não é a soma dos pesos máximos
por dimensão isolada (esse valor não é alcançável, pois só é possível escolher uma
alternativa por pergunta). Em vez disso, para cada pergunta é escolhida a alternativa
que mais favorece aquele curso especificamente, e os valores são somados. Esse máximo
é sempre alcançável por algum conjunto real de respostas, o que permite que perfis
muito alinhados cheguem a 90%+ de afinidade, como nos exemplos da especificação.

**Nota sobre distintividade por dimensão (`src/engine/scoringEngine.ts`):**
dimensões que aparecem em quase todos os cursos (como "criatividade" ou
"raciocínio lógico") diferenciam pouco um curso do outro. Dimensões raras
(como "eletrônica", quase exclusiva de Robótica, ou "estética visual", quase
exclusiva de Design Gráfico) são muito mais informativas para decidir *entre*
cursos parecidos. Por isso, antes de pontuar, cada peso da matriz de cursos é
multiplicado por um fator de distintividade — uma versão simplificada de
IDF ("inverse document frequency", técnica clássica de sistemas de busca e
recomendação): dimensões usadas por todos os 6 cursos ficam com fator ~1
(neutro); dimensões usadas por 1 único curso chegam a ~2.3x. Isso resolve o
problema de Programação e Robótica (ou Animação Digital e Design Gráfico)
ficarem com pontuações quase idênticas para perfis mistos — o fator amplifica
justamente o que torna cada curso único.

Informática Moderna é sempre calculada **separadamente**, com sua própria matriz de
pesos, e nunca compete com os cursos principais no ranking — ela aparece como
indicação de complemento (alta / moderada / baixa, conforme faixas de pontuação em
`src/config/scoring.ts`).

## Imagem de resultado para download

Na tela de resultado, o botão **"Baixar resultado em imagem"** gera uma imagem PNG
(`src/engine/resultImage.ts`) inteiramente no navegador, via Canvas 2D — sem
nenhum serviço externo ou upload de dados. A imagem inclui nome completo e idade do
aluno, a síntese do perfil, o curso principal com sua posição no ranking (medalha 🥇
para o 1º lugar), a ordem de afinidade completa e o curso complementar (quando
houver). O nome do arquivo é gerado a partir do nome do aluno (ex.:
`techers-perfil-maria-santos.png`).

## Exibição de resultado: ordem, não porcentagem

A interface e a imagem baixada nunca mostram o percentual de afinidade — apenas a
**ordem** entre os cursos (🥇🥈🥉 para os três primeiros, "4º", "5º" para os
demais), evitando a falsa precisão de um número (a diferença entre 81% e 79% não é
significativa, mas "1º" e "2º" comunicam a mesma informação sem parecer uma nota
exata). Internamente, o motor de recomendação continua calculando a pontuação
0–100 normalmente — ela só não é exibida — e continua sendo usada para decidir
elegibilidade, perfil híbrido e trajetórias futuras (ver `src/types.ts` >
`CourseAffinity.score`).

## Como alterar perguntas

Edite `src/config/questions.ts`. Cada pergunta tem um `id`, uma `title` e uma lista
de `options`, cada uma com um `label` e um objeto `weights` (dimensão → peso). Basta
adicionar, remover ou reescrever perguntas — o motor de recomendação e a barra de
progresso se adaptam automaticamente ao número de perguntas (inclusive o cálculo do
máximo alcançável por curso). Atualmente são 10 perguntas, escritas para não exigir
nenhum conhecimento prévio de programação, tecnologia ou dos cursos da TECHERS —
todas partem de situações do dia a dia (um quebra-cabeça, uma tarefa de escola, um
aparelho novo) em vez de vocabulário técnico.

A barra de progresso é linear: 1 tela de identificação + N perguntas = N+1 telas, e
cada tela avança exatamente 1/(N+1) do total. Isso evita o problema da versão
anterior, em que várias perguntas ficavam agrupadas sob a mesma "etapa" e a barra
parecia travada por várias telas seguidas.

## Como alterar pesos

Edite `src/config/scoring.ts` (`courseWeights`). Escala sugerida: 0 (não relacionado)
a 5 (relação muito alta). Após qualquer alteração, rode `npm test` — os 8 perfis
fictícios de `src/tests/sampleProfiles.ts` ajudam a identificar se um curso passou a
ser favorecido ou prejudicado indevidamente. Para testar perfis manualmente, use
`runRecommendationTest(answers, age)` em `src/tests/simulator.ts`.

### Ajustes de pesos em relação à especificação original

A tabela de pesos original do briefing tinha dimensões redundantes (por exemplo,
"organização", "apresentações" e "estudos" apareciam como dimensões separadas, mas
media essencialmente a mesma coisa em contextos diferentes). Para evitar dupla
contagem do mesmo traço dentro de um mesmo curso, essas dimensões foram consolidadas
— o racional completo de cada consolidação está comentado no topo de
`src/config/scoring.ts`.

## Como alterar cursos

Edite `src/config/courses.ts`. Cada curso tem nome, ícone, textos, listas de
"o que constrói" / "o que aprende" / habilidades, `ageRange` (`min` e `max`, sendo
`max: null` para "a partir de X anos"), carga horária, duração e uma cor de destaque
(`accent`) usada nos gráficos de afinidade.

## Como alterar faixas etárias

Altere apenas o campo `ageRange` de cada curso em `src/config/courses.ts`. As regras
de elegibilidade (`src/config/ageRules.ts`) leem esse campo automaticamente — não há
números de idade duplicados em nenhum outro lugar do código.

## Como alterar identidade visual

Cores e fontes ficam centralizadas em `src/index.css`, dentro do bloco `@theme`
(variáveis `--color-*` e `--font-*`). A cor de destaque de cada curso individual fica
em `accent`, no respectivo curso, em `src/config/courses.ts`.

## Como adicionar novas perguntas

1. Adicione um novo objeto em `src/config/questions.ts`, com `id` único e ao menos
   3–5 `options`, cada uma com `weights` para as dimensões que ela deve influenciar
   (ver lista completa de dimensões em `src/types.ts`). Prefira sempre situações do
   dia a dia a vocabulário técnico — o aluno pode nunca ter visto programação,
   robótica ou qualquer um dos cursos antes.
2. Rode `npm test` para conferir se os perfis de exemplo continuam batendo com o
   curso esperado.
3. Não é necessário alterar nenhum outro arquivo — o formulário, a barra de
   progresso e o motor de recomendação leem a lista de perguntas dinamicamente.

## Painel de configuração

Não foi criada uma interface administrativa separada (aumentaria a complexidade sem
necessidade real). Em vez disso, os quatro arquivos de configuração —
`courses.ts`, `questions.ts`, `scoring.ts` e `ageRules.ts` — foram escritos para
serem lidos e editados diretamente, com comentários explicando cada decisão.

## Arquitetura

```
src/
├── config/          # cursos, perguntas, pesos e regras de idade (dados puros)
│   ├── courses.ts
│   ├── questions.ts
│   ├── scoring.ts
│   └── ageRules.ts
│
├── engine/          # lógica de recomendação, sem nenhuma dependência de UI
│   ├── profileEngine.ts        # respostas -> perfil multidimensional
│   ├── scoringEngine.ts        # perfil -> afinidade % por curso
│   ├── rankingEngine.ts        # afinidade -> ranking, híbridos, trajetórias futuras
│   ├── recommendationEngine.ts # ponto único de entrada (recommend)
│   ├── synthesis.ts            # síntese textual determinística do perfil
│   └── validation.ts           # validação dos dados de identificação
│
├── components/
│   ├── questionnaire/  # etapa de identificação e etapa de pergunta
│   ├── results/        # hero, ranking, complemento, trajetórias futuras
│   └── ui/              # botão, barra de progresso, medidor de afinidade, logo
│
├── pages/            # composição das telas (resultado)
├── tests/            # perfis fictícios + testes automatizados (Vitest)
└── types.ts          # todos os tipos centrais do domínio
```

A lógica de recomendação (`engine/`) não importa nada de `components/` — pode ser
testada e reutilizada de forma totalmente independente da interface.

## Logo

Coloque o arquivo em `public/logo-techers.png`. Se o arquivo não existir, a
interface mostra automaticamente um fallback elegante com o texto "TECHERS"
(`src/components/ui/Logo.tsx`).

## Privacidade

Não há banco de dados, backend ou serviço de terceiros. As respostas ficam apenas na
memória do navegador durante a sessão e são descartadas ao recarregar a página. Não
há Google Analytics, Meta Pixel ou qualquer tracker.
