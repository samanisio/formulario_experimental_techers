import type { ProfileQuestion } from "../types";

// Perguntas situacionais do dia a dia — nenhuma pressupõe que o aluno já
// programou, já usou ferramentas digitais avançadas ou já conhece os cursos
// da TECHERS. Cada alternativa só altera dimensões do perfil (ver
// src/types.ts); nenhuma pergunta associa uma resposta diretamente a um
// curso. Para adicionar, remover ou reformular perguntas, edite somente
// este arquivo — o motor de recomendação e a barra de progresso se
// adaptam automaticamente ao número de perguntas.

export const questions: ProfileQuestion[] = [
  {
    id: "q1",
    title: "Se você pudesse escolher uma atividade para fazer numa tarde livre, qual seria?",
    options: [
      { id: "a", label: "Inventar um jogo ou desafio para os amigos jogarem", weights: { programming: 4, games: 5, creativity: 3, logicalReasoning: 2, projects: 3, technology: 3 } },
      { id: "b", label: "Construir algo novo com peças, blocos ou materiais que eu tenha em casa", weights: { construction: 5, practicalActivities: 5, robotics: 2, fineMotorSkills: 3 } },
      { id: "c", label: "Desenhar um personagem e inventar uma aventura para ele", weights: { drawing: 5, storytelling: 4, imagination: 4, art: 3 } },
      { id: "d", label: "Criar uma decoração, cartaz ou capa bem bonita e caprichada", weights: { design: 5, aestheticSense: 4, visualCreativity: 4, creativity: 3 } },
      { id: "e", label: "Organizar uma tarefa ou projeto do começo ao fim, do meu jeito", weights: { digitalProductivity: 4, projects: 4, digitalAutonomy: 3, teamwork: 2 } },
    ],
  },
  {
    id: "q2",
    title: "Quando alguém te dá um aparelho novo (celular, tablet, controle), o que você faz primeiro?",
    options: [
      { id: "a", label: "Fico mexendo em tudo até descobrir sozinho como funciona", weights: { technology: 5, digitalAutonomy: 5, problemSolving: 3 } },
      { id: "b", label: "Peço pra alguém me explicar antes de usar", weights: { teamwork: 3, digitalAutonomy: 1 } },
      { id: "c", label: "Uso só pra jogar ou assistir alguma coisa", weights: { games: 3, technology: 1 } },
      { id: "d", label: "Prefiro nem mexer muito, gosto mais de coisas fora da tela", weights: { construction: 2, practicalActivities: 3 } },
    ],
  },
  {
    id: "q3",
    title: "Você está tentando montar um quebra-cabeça bem difícil e não está conseguindo. O que você faz?",
    options: [
      { id: "a", label: "Tento de um jeito, depois de outro, até uma hora encontrar o certo", weights: { logicalReasoning: 5, problemSolving: 5 } },
      { id: "b", label: "Separo as peças por cor ou formato para organizar antes de continuar", weights: { logicalReasoning: 3, digitalProductivity: 3, attentionToDetail: 3 } },
      { id: "c", label: "Paro, penso um pouco e imagino como ele deve ficar pronto", weights: { imagination: 4, creativity: 3, logicalReasoning: 2 } },
      { id: "d", label: "Chamo alguém para tentar junto comigo", weights: { teamwork: 5, problemSolving: 2 } },
    ],
  },
  {
    id: "q4",
    title: "Qual dessas coisas parece mais divertida pra você?",
    options: [
      { id: "a", label: "Montar uma torre bem alta e testar até onde ela aguenta", weights: { construction: 5, practicalActivities: 5, problemSolving: 3, fineMotorSkills: 3 } },
      { id: "b", label: "Abrir um brinquedo velho só para ver como é por dentro", weights: { electronics: 4, technology: 4, robotics: 3, problemSolving: 2 } },
      { id: "c", label: "Inventar as regras de um jogo novo, com pontos e desafios", weights: { programming: 3, games: 4, logicalReasoning: 3, creativity: 2 } },
      { id: "d", label: "Fazer um desenho bem detalhado de uma máquina ou robô imaginário", weights: { drawing: 4, imagination: 4, robotics: 2, design: 2 } },
    ],
  },
  {
    id: "q5",
    title: "Se você fosse criar um personagem novo, o que mais te animaria?",
    options: [
      { id: "a", label: "Desenhar como ele é: rosto, roupa, cores", weights: { drawing: 5, art: 4, visualCreativity: 4, imagination: 3 } },
      { id: "b", label: "Inventar a história dele: de onde veio, o que ele quer", weights: { storytelling: 5, imagination: 4, creativity: 3 } },
      { id: "c", label: "Pensar em como ele se moveria e falaria numa animação", weights: { animation: 5, storytelling: 3, drawing: 2 } },
      { id: "d", label: "Pensar em como mostrar ele de um jeito bonito, tipo num pôster", weights: { design: 4, aestheticSense: 4, visualCreativity: 3 } },
    ],
  },
  {
    id: "q6",
    title: "Quando você tem uma tarefa grande da escola para fazer, você prefere…",
    options: [
      { id: "a", label: "Fazer uma lista e ir organizando cada parte, uma de cada vez", weights: { digitalProductivity: 5, digitalAutonomy: 3, attentionToDetail: 2 } },
      { id: "b", label: "Já começar fazendo, e ir ajeitando no caminho", weights: { practicalActivities: 3, digitalAutonomy: 2, problemSolving: 2 } },
      { id: "c", label: "Deixar bem bonito e caprichado, com desenhos ou cores", weights: { design: 3, aestheticSense: 3, visualCreativity: 2 } },
      { id: "d", label: "Fazer em grupo, dividindo as partes com os colegas", weights: { teamwork: 5, digitalProductivity: 2 } },
    ],
  },
  {
    id: "q7",
    title: "Qual dessas frases combina mais com você?",
    options: [
      { id: "a", label: "Gosto de jogar e também penso em como seria criar meu próprio jogo", weights: { games: 5, programming: 4, creativity: 3 } },
      { id: "b", label: "Gosto bastante de jogar, mas nunca pensei em como o jogo foi feito", weights: { games: 4, technology: 1 } },
      { id: "c", label: "Prefiro inventar brincadeiras e desafios a jogar os prontos", weights: { games: 2, creativity: 4, projects: 2 } },
      { id: "d", label: "Jogos não são muito a minha praia", weights: { teamwork: 1 } },
    ],
  },
  {
    id: "q8",
    title: "Você já viu um aplicativo que parece \"entender\" o que você fala ou pede. O que você acha disso?",
    options: [
      { id: "a", label: "Acho incrível, queria aprender a criar uma coisa assim", weights: { artificialIntelligence: 5, programming: 3, technology: 3 } },
      { id: "b", label: "Uso bastante para me ajudar a estudar ou tirar dúvidas", weights: { artificialIntelligence: 4, digitalProductivity: 3, digitalAutonomy: 2 } },
      { id: "c", label: "Acho legal, mas prefiro fazer as coisas do meu próprio jeito", weights: { digitalAutonomy: 4, artificialIntelligence: 1 } },
      { id: "d", label: "Nunca parei para pensar nisso", weights: { artificialIntelligence: 1 } },
    ],
  },
  {
    id: "q9",
    title: "Você aprende uma coisa nova melhor quando…",
    options: [
      { id: "a", label: "Coloca a mão na massa e vai testando", weights: { practicalActivities: 5, construction: 3, fineMotorSkills: 2 } },
      { id: "b", label: "Alguém te explica o passo a passo com calma", weights: { logicalReasoning: 3, teamwork: 2 } },
      { id: "c", label: "Você vê um exemplo bem visual, com cores e imagens", weights: { visualCreativity: 4, imagination: 3, design: 2 } },
      { id: "d", label: "Você cria algo do seu próprio jeito, sem seguir um modelo", weights: { creativity: 5, projects: 3, digitalAutonomy: 2 } },
    ],
  },
  {
    id: "q10",
    title: "Imagine que você tem uma tarde inteira livre e pode criar qualquer coisa. O que você escolheria?",
    helper: "Pense no que faria você perder a noção do tempo.",
    options: [
      { id: "a", label: "Um jogo ou desafio digital para jogar com os amigos", weights: { programming: 5, games: 4, creativity: 3, technology: 4, projects: 4, challenges: 3 } },
      { id: "b", label: "Uma construção ou invenção que realmente funcione", weights: { robotics: 5, construction: 5, electronics: 4, challenges: 4, problemSolving: 4 } },
      { id: "c", label: "Um desenho animado com personagens e uma história", weights: { animation: 5, drawing: 4, storytelling: 5, art: 3, imagination: 4 } },
      { id: "d", label: "Uma arte, identidade visual ou post incrível para mostrar pros outros", weights: { design: 5, visualCreativity: 5, aestheticSense: 4, creativity: 3 } },
      { id: "e", label: "Um projeto bem organizado, usando as melhores ferramentas que eu encontrar", weights: { digitalProductivity: 5, digitalTools: 5, digitalAutonomy: 4, artificialIntelligence: 3 } },
    ],
  },
];
