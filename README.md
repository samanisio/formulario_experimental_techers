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

## Download do resultado: imagem + PDF em um único clique

Na tela de resultado, o botão **"Baixar resultado"** dispara dois arquivos ao mesmo
tempo, ambos gerados inteiramente no navegador (sem backend, sem upload de dados):

1. **Imagem PNG** (`src/engine/resultImage.ts`, via Canvas 2D) — hierarquia visual
   em duas partes, para não repetir o curso #1: um cartão grande de destaque
   ("🥇 Curso mais indicado") com nome, descrição resumida, descrição completa e
   posição no ranking; logo abaixo, "📋 Demais cursos recomendados" traz o resto da
   lista (a partir do 2º colocado) em formato compacto, com nome + descrição
   resumida de cada curso. O curso complementar (Informática Moderna) só aparece
   quando o diagnóstico realmente o indica — quando não é necessário, a seção
   simplesmente não existe na imagem (nunca aparece como "não indicada"). Quando
   nenhum curso principal está disponível para a idade informada, o cartão de
   destaque vira um aviso explicando isso, e a lista mostra todos os cursos
   calculados. Arquivo: `cursos-recomendados-{nome-do-aluno}.png`.
2. **Relatório PDF** (`src/engine/resultPdf.ts`, via jsPDF) — logo oficial da
   TECHERS e roxo (`#6d28d9`) como cor de destaque em todo o relatório (barras de
   seção, cartão de dados do aluno, rótulos de pergunta/resposta, linha de cada
   bloco e rodapé); cada curso recomendado usa sua própria cor de destaque
   (`courses.ts`), a mesma da imagem e da tela de resultado. Ordem do conteúdo:
   **1) dados do aluno** (nome, idade e, se preenchidos, nome e telefone do
   responsável — campos vazios são omitidos, não aparecem em branco);
   **2) cursos recomendados**, na mesma ordem usada na imagem, cada um com sua
   descrição resumida, e o curso complementar quando indicado; **3) todas as
   perguntas do formulário com suas respectivas respostas**, na ordem em que
   foram feitas. Nenhuma lógica de recomendação é duplicada — o PDF lê o mesmo
   `RecommendationResult` já calculado. Quebra de página automática: cada bloco de
   pergunta+resposta (ou curso+descrição) é medido antes de ser desenhado e só é
   dividido entre páginas se for maior que uma página inteira, evitando cortar uma
   pergunta de um lado e a resposta do outro. Arquivo:
   `relatorio-{nome-do-aluno}.pdf`.

Os dois downloads partem de um único clique (`DownloadResultButton.tsx`): as
imagens/PDF são geradas em paralelo (`Promise.all`) e disparadas com um pequeno
intervalo entre si, para evitar que o navegador bloqueie o segundo arquivo como
pop-up indesejado. O nome do aluno é sanitizado (sem acentos, espaços ou
caracteres especiais) antes de virar nome de arquivo.

## Descrição resumida de cada curso

Cada curso já tem, em `src/config/courses.ts`, um campo `tagline` — uma frase curta
e oficial (não inventada) que resume o curso. Esse mesmo campo é reaproveitado em
três lugares: na lista compacta da imagem, na lista de "demais cursos" da tela de
resultado e na lista de cursos do PDF — sempre a mesma fonte de dados, nunca
duplicada ou reescrita.

## Informática Moderna: só aparece quando faz sentido

A indicação de Informática Moderna (`result.complementary`) é sempre calculada,
mas só é **exibida** quando o diagnóstico aponta afinidade real — tier `"alta"` ou
`"moderada"` (`src/config/scoring.ts` > `IM_TIER_THRESHOLDS`). Quando o tier é
`"baixa"`, a seção inteira é omitida — na tela (`ComplementaryCard.tsx`), na
imagem e no PDF — nunca aparece como "não indicada". Essa checagem
(`tier !== "baixa"`) é a mesma nos três lugares.

## Exibição de resultado: ordem, não porcentagem

A interface e a imagem baixada nunca mostram o percentual de afinidade — apenas a
**ordem** entre os cursos (🥇🥈🥉 para os três primeiros, "4º", "5º" para os
demais), evitando a falsa precisão de um número (a diferença entre 81% e 79% não é
significativa, mas "1º" e "2º" comunicam a mesma informação sem parecer uma nota
exata). Internamente, o motor de recomendação continua calculando a pontuação
0–100 normalmente — ela só não é exibida — e continua sendo usada para decidir
elegibilidade, perfil híbrido e trajetórias futuras (ver `src/types.ts` >
`CourseAffinity.score`).

## Validação do formulário

Todas as perguntas de perfil são obrigatórias: o botão "Continuar" nunca avança
sem uma resposta selecionada — ao tentar, uma mensagem ("Escolha uma opção para
continuar.") aparece abaixo das alternativas em vez de simplesmente desabilitar o
botão silenciosamente. A validação da tela de identificação (nome completo com
duas palavras, idade entre 5 e 17) segue a mesma lógica (`src/engine/validation.ts`).
Nome e telefone do responsável continuam opcionais, como já era.

Todas as respostas — de identificação e de perfil — ficam em estado no componente
`App`, nunca são limpas ao navegar entre telas: o aluno pode ir e voltar livremente
pelo formulário sem perder nada do que já preencheu.

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

**O formulário não tem idade máxima própria** — qualquer pessoa com 5 anos ou mais
pode preenchê-lo (`src/engine/validation.ts` só valida o mínimo). Quem preenche o
formulário passa dos 17 anos (ou de qualquer `ageRange.max` dos cursos principais)
simplesmente não vê nenhum curso como "disponível agora" — o `primaryCourse` do
resultado vem `null`, e a interface, a imagem e o PDF mostram um aviso claro em vez
de um curso (ver `NoPrimaryNotice.tsx`, e os blocos `if (!result.primaryCourse)` em
`resultImage.ts`/`resultPdf.ts`). Informática Moderna, que não tem idade máxima
(`ageRange.max: null`), continua sendo calculada e pode aparecer normalmente como
complemento mesmo quando nenhum curso principal está disponível.

Um curso só é classificado como **"próxima etapa"** quando o aluno ainda não chegou
na idade mínima dele — nunca quando ele já passou da idade máxima
(`src/engine/rankingEngine.ts` > `isUpcoming`). Isso evita, por exemplo, que uma
pessoa de 40 anos veja "Programação: próxima etapa", o que sugeriria (errado) que o
curso ficará disponível para ela algum dia.

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
