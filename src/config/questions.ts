import type { ProfileQuestion } from "../types";

// Perguntas situacionais do dia a dia — nenhuma pressupõe que o aluno já
// programou, já usou ferramentas digitais avançadas ou já conhece os cursos
// da TECHERS. Cada alternativa só altera dimensões do perfil (ver
// src/types.ts); nenhuma pergunta associa uma resposta diretamente a um
// curso.
//
// Desenho estrutural (importante para manter o equilíbrio entre cursos):
// cada pergunta oferece, sempre que o cenário permite com naturalidade, uma
// alternativa dedicada a cada um dos 5 direcionamentos principais —
// Programação, Robótica, Animação Digital, Design Gráfico e Informática
// Moderna/produtividade. Isso garante que TODOS os cursos apareçam com
// força parecida ao longo do formulário inteiro; sem essa simetria,
// dimensões "genéricas" (como criatividade) acabam favorecendo sempre os
// mesmos cursos, enquanto dimensões mais específicas (como robótica ou
// animação) ficam sub-representadas. O equilíbrio é verificado por
// simulação em scripts/balance-check.ts (não faz parte do app).
//
// Cada pergunta cobre um cenário distinto (nenhuma repete a premissa de
// outra) e foi desenhada a partir do conteúdo real de cada curso em
// src/config/courses.ts. Se algum texto precisar de aspas, use aspas
// tipográficas — abertura (“) e fechamento (”) sempre diferentes.
//
// Importante sobre as alternativas de Design Gráfico: NENHUMA menciona
// "desenhar" — é um mito comum (mas falso) que design exige saber desenhar.
// As alternativas de design usam edição de fotos/colagem (mediaEditing),
// observação/apreciação de peças visuais prontas (visualCuration) e
// comunicação de ideias (communication), que é como o curso funciona de
// verdade (ver courses.ts > design-grafico).
//
// Importante sobre as alternativas de Animação Digital: evite concentrar
// tudo em "história/roteiro" — o curso também é sobre movimento, dublagem,
// stop-motion, direção/ritmo de cena e repetição/aperfeiçoamento (ver
// courses.ts > animacao-digital > whatYouBuild/whatYouLearn/skills). Das 10
// perguntas, só a pergunta 10 menciona história explicitamente; as outras
// cobrem facetas diferentes do curso para não ficar repetitivo.
//
// Para adicionar, remover ou reformular perguntas, edite somente este
// arquivo — o motor de recomendação e a barra de progresso se adaptam
// automaticamente ao número de perguntas.

export const questions: ProfileQuestion[] = [
  {
    id: "q1",
    title: "Imagine que sua turma vai montar um estande para mostrar um projeto para os pais na escola. Qual tarefa você escolheria fazer?",
    options: [
      { id: "a", label: "Programar uma demonstração ou joguinho para mostrar no computador", weights: { programming: 5, logicalReasoning: 3, technology: 3, games: 2 } },
      { id: "b", label: "Montar a estrutura física do estande, com peças e mecanismos que se mexem", weights: { robotics: 5, construction: 4, electronics: 3, practicalActivities: 3 } },
      { id: "c", label: "Desenhar os personagens e fazer um vídeo curtinho deles se mexendo", weights: { drawing: 4, animation: 5, imagination: 3 } },
      { id: "d", label: "Criar o cartaz e a identidade visual do estande, com cores e um logotipo", weights: { design: 5, visualCreativity: 4, aestheticSense: 3, communication: 2 } },
      { id: "e", label: "Organizar a apresentação: o que entra em cada slide e a ordem das falas", weights: { digitalProductivity: 5, digitalAutonomy: 3, projects: 2 } },
    ],
  },
  {
    id: "q2",
    title: "Você ganhou uma caixa cheia de sucata (potes, fios, papelão, tecido) e uma tarde livre. O que você faria com ela?",
    options: [
      { id: "a", label: "Não usaria a caixa — preferiria montar ou programar algo no computador", weights: { programming: 4, technology: 4, logicalReasoning: 2 } },
      { id: "b", label: "Uma máquina ou robô que realmente se mexesse", weights: { robotics: 5, construction: 4, electronics: 3, practicalActivities: 3 } },
      { id: "c", label: "Um bonequinho articulado, pra fotografar em poses diferentes e fazer ele parecer se mexer", weights: { animation: 5, attentionToDetail: 3, imagination: 2 } },
      { id: "d", label: "Uma decoração ou escultura bem caprichada e bonita", weights: { design: 4, aestheticSense: 4, visualCreativity: 3, creativity: 3 } },
      { id: "e", label: "Organizaria tudo por tipo e cor antes de decidir o que fazer", weights: { digitalProductivity: 3, attentionToDetail: 4, digitalAutonomy: 2 } },
    ],
  },
  {
    id: "q3",
    title: "Sua turma recebeu uma missão: resolver um mistério, tipo um jogo de detetive. Qual parte você ia querer fazer?",
    options: [
      { id: "a", label: "Criar um programa ou app para organizar as pistas encontradas", weights: { programming: 4, logicalReasoning: 4, technology: 3 } },
      { id: "b", label: "Montar armadilhas ou mecanismos para testar as pistas na prática", weights: { robotics: 3, construction: 4, problemSolving: 4, practicalActivities: 3 } },
      { id: "c", label: "Dar uma voz e um jeito de falar diferente para cada suspeito, quase dublando eles", weights: { animation: 4, imagination: 3, attentionToDetail: 2 } },
      { id: "d", label: "Criar cartazes de \u201Cprocurado\u201D bem caprichados para cada suspeito", weights: { design: 4, visualCreativity: 4, aestheticSense: 3 } },
      { id: "e", label: "Organizar todas as provas numa lista bem estruturada", weights: { digitalProductivity: 4, attentionToDetail: 4, logicalReasoning: 2 } },
    ],
  },
  {
    id: "q4",
    title: "Se você ganhasse um computador ou tablet novo, o que mais ia querer aprender a fazer nele primeiro?",
    options: [
      { id: "a", label: "Programar meu primeiro jogo ou site", weights: { programming: 5, technology: 3, logicalReasoning: 2 } },
      { id: "b", label: "Controlar um robozinho ou brinquedo conectado a ele", weights: { robotics: 4, technology: 4, electronics: 2 } },
      { id: "c", label: "Fazer um personagem se mexer e ganhar vida numa animação", weights: { animation: 5, drawing: 3, imagination: 2 } },
      { id: "d", label: "Editar fotos, criar thumbnails ou artes usando fotos e textos", weights: { mediaEditing: 5, visualCreativity: 3, design: 2 } },
      { id: "e", label: "Organizar meus trabalhos da escola e aprender truques para estudar melhor", weights: { digitalProductivity: 5, digitalAutonomy: 3, artificialIntelligence: 2 } },
    ],
  },
  {
    id: "q5",
    title: "Se você fosse criar um personagem para um jogo ou uma história, o que mais te animaria fazer?",
    options: [
      { id: "a", label: "Programar como ele se move e reage dentro de um jogo", weights: { programming: 4, logicalReasoning: 3, games: 3 } },
      { id: "b", label: "Criar um boneco ou protótipo físico dele, tipo um brinquedo", weights: { construction: 4, robotics: 2, practicalActivities: 3, fineMotorSkills: 2 } },
      { id: "c", label: "Desenhar como ele é e pensar no jeito dele se mexer e reagir às coisas", weights: { drawing: 5, animation: 3, imagination: 2 } },
      { id: "d", label: "Montar uma colagem dele com fotos e recortes, criando um cenário ao redor", weights: { mediaEditing: 4, visualCreativity: 3, imagination: 2, design: 2 } },
      { id: "e", label: "Escrever tudo sobre ele de um jeito bem organizado, numa ficha", weights: { digitalProductivity: 3, attentionToDetail: 3, digitalAutonomy: 2 } },
    ],
  },
  {
    id: "q6",
    title: "Quando você tem um trabalho grande da escola para fazer, qual seria o seu jeito preferido de organizar tudo?",
    options: [
      { id: "a", label: "Criar um passo a passo bem lógico, quase como as instruções de um programa", weights: { logicalReasoning: 4, programming: 2, problemSolving: 3 } },
      { id: "b", label: "Montar uma maquete ou modelo físico para representar o trabalho", weights: { construction: 3, robotics: 2, practicalActivities: 4, fineMotorSkills: 2 } },
      { id: "c", label: "Transformar o trabalho num vídeo animado curtinho, com cenas se movendo", weights: { animation: 4, imagination: 2, creativity: 2 } },
      { id: "d", label: "Caprichar no visual: cores, capa bonita, tudo esteticamente organizado", weights: { design: 4, aestheticSense: 4, visualCreativity: 3 } },
      { id: "e", label: "Usar uma lista de tarefas e ir organizando cada etapa, uma de cada vez", weights: { digitalProductivity: 5, digitalAutonomy: 3, attentionToDetail: 2 } },
    ],
  },
  {
    id: "q7",
    title: "Se sua turma fosse gravar um vídeo para postar nas redes sociais da escola, qual parte você ia querer fazer?",
    options: [
      { id: "a", label: "Programar um efeito especial ou uma parte interativa do vídeo", weights: { programming: 3, technology: 4, logicalReasoning: 2 } },
      { id: "b", label: "Cuidar da parte técnica: câmera, luzes e os equipamentos", weights: { electronics: 3, technology: 4, practicalActivities: 3, robotics: 1 } },
      { id: "c", label: "Decidir a ordem das cenas e o ritmo de cada corte, tipo um diretor", weights: { animation: 3, attentionToDetail: 3, imagination: 2 } },
      { id: "d", label: "Editar o vídeo e criar a capa (thumbnail) para chamar atenção", weights: { mediaEditing: 5, design: 2, communication: 2 } },
      { id: "e", label: "Organizar o cronograma de gravação e publicar tudo direitinho", weights: { digitalProductivity: 4, digitalAutonomy: 3, digitalTools: 3 } },
    ],
  },
  {
    id: "q8",
    title: "Se você pudesse ter um assistente de Inteligência Artificial te ajudando, para que mais gostaria de usar ele?",
    options: [
      { id: "a", label: "Para me ajudar a programar e criar projetos mais rápido", weights: { artificialIntelligence: 5, programming: 4, technology: 3 } },
      { id: "b", label: "Para me ajudar a criar animações ou dar vida a personagens", weights: { artificialIntelligence: 3, animation: 4, storytelling: 2 } },
      { id: "c", label: "Para criar imagens, artes ou vídeos", weights: { artificialIntelligence: 5, design: 4, visualCreativity: 3 } },
      { id: "d", label: "Para estudar, organizar tarefas e pesquisar", weights: { artificialIntelligence: 5, digitalProductivity: 4, digitalAutonomy: 3 } },
      { id: "e", label: "Ainda não sei, nunca usei nada assim", weights: { artificialIntelligence: 1 } },
    ],
  },
  {
    id: "q9",
    title: "Você aprende uma coisa nova melhor quando…",
    options: [
      { id: "a", label: "Segue um raciocínio lógico, passo a passo, testando e corrigindo erros", weights: { logicalReasoning: 5, programming: 3, problemSolving: 3 } },
      { id: "b", label: "Coloca a mão na massa: monta, testa e desmonta até entender", weights: { practicalActivities: 5, construction: 3, robotics: 2, problemSolving: 2 } },
      { id: "c", label: "Repete e ajusta várias vezes até o movimento ou o resultado ficar do jeito certo", weights: { attentionToDetail: 4, animation: 3, imagination: 2 } },
      { id: "d", label: "Observa um exemplo bem feito visualmente — tipo a capa de um livro ou um pôster bem bolado — e se inspira nele", weights: { visualCuration: 5, aestheticSense: 3, design: 1 } },
      { id: "e", label: "Segue um passo a passo escrito, organizado em etapas bem claras", weights: { digitalProductivity: 4, attentionToDetail: 3, digitalAutonomy: 2 } },
    ],
  },
  {
    id: "q10",
    title: "Imagine que você tem uma tarde inteira livre, sozinho, e pode criar qualquer coisa. O que você escolheria?",
    helper: "Pense no que faria você perder a noção do tempo.",
    options: [
      { id: "a", label: "Um jogo ou desafio digital para jogar com os amigos", weights: { programming: 5, games: 4, technology: 4, logicalReasoning: 3, projects: 3, challenges: 3 } },
      { id: "b", label: "Uma construção ou invenção que realmente funcione", weights: { robotics: 5, construction: 5, electronics: 4, challenges: 4, problemSolving: 4 } },
      { id: "c", label: "Um desenho animado com personagens e uma história", weights: { animation: 5, drawing: 4, storytelling: 5, art: 3, imagination: 4 } },
      { id: "d", label: "Uma arte, identidade visual ou post incrível para mostrar pros outros", weights: { design: 5, visualCreativity: 5, aestheticSense: 4, creativity: 3 } },
      { id: "e", label: "Um projeto bem organizado, usando as melhores ferramentas que eu encontrar", weights: { digitalProductivity: 5, digitalTools: 5, digitalAutonomy: 4, artificialIntelligence: 3 } },
    ],
  },
];
