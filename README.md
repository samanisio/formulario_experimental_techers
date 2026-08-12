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
Pontuação de cada curso (produto escalar perfil × matriz de pesos do curso)
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

Informática Moderna é sempre calculada **separadamente**, com sua própria matriz de
pesos, e nunca compete com os cursos principais no ranking — ela aparece como
indicação de complemento (alta / moderada / baixa, conforme faixas de pontuação em
`src/config/scoring.ts`).

## Como alterar perguntas

Edite `src/config/questions.ts`. Cada pergunta tem um `id`, uma `title`, um `step`
(1 a 5, define em qual etapa do formulário ela aparece) e uma lista de `options`,
cada uma com um `label` e um objeto `weights` (dimensão → peso). Basta adicionar,
remover ou reescrever perguntas — o motor de recomendação se adapta automaticamente
(inclusive o cálculo do máximo alcançável por curso).

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

1. Adicione um novo objeto em `src/config/questions.ts`, com `id` único, `step` (1–5)
   e ao menos 3–5 `options`, cada uma com `weights` para as dimensões que ela deve
   influenciar (ver lista completa de dimensões em `src/types.ts`).
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
