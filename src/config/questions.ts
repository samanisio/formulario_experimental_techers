import type { ProfileQuestion } from "../types";

// Perguntas situacionais e indiretas — nenhuma pergunta associa uma resposta
// diretamente a um curso. Cada alternativa apenas altera dimensões do perfil
// (ver src/types.ts). Para adicionar, remover ou reformular perguntas, edite
// somente este arquivo: o motor de recomendação se adapta automaticamente.

export const questions: ProfileQuestion[] = [
  {
    id: "q1",
    step: 2,
    title: "Se você pudesse escolher um projeto para começar agora, qual seria?",
    options: [
      { id: "a", label: "Criar um jogo do zero", weights: { programming: 5, games: 5, logicalReasoning: 3, creativity: 3, technology: 4, projects: 3 } },
      { id: "b", label: "Montar um robô que se mexe sozinho", weights: { robotics: 5, construction: 5, electronics: 4, problemSolving: 3, practicalActivities: 4 } },
      { id: "c", label: "Desenhar um personagem e dar vida a ele numa animação", weights: { drawing: 5, animation: 5, storytelling: 4, art: 4, imagination: 4 } },
      { id: "d", label: "Criar uma arte ou identidade visual para postar", weights: { design: 5, visualCreativity: 5, aestheticSense: 4, creativity: 3 } },
      { id: "e", label: "Organizar e criar uma apresentação incrível para um trabalho", weights: { digitalProductivity: 5, digitalTools: 4, digitalAutonomy: 3, design: 2 } },
    ],
  },
  {
    id: "q2",
    step: 4,
    title: "Quando você usa um computador ou tablet, o que mais gosta de fazer?",
    options: [
      { id: "a", label: "Jogar e tentar entender como o jogo funciona por dentro", weights: { games: 5, technology: 4, problemSolving: 3, programming: 2 } },
      { id: "b", label: "Assistir vídeos e pesquisar coisas que tenho curiosidade", weights: { digitalAutonomy: 3, technology: 2, artificialIntelligence: 1 } },
      { id: "c", label: "Criar textos, slides ou desenhos digitais", weights: { digitalProductivity: 4, digitalTools: 4, design: 2, creativity: 2 } },
      { id: "d", label: "Mexer em configurações e descobrir como as coisas funcionam por dentro", weights: { technology: 5, digitalAutonomy: 5, problemSolving: 3, programming: 2 } },
      { id: "e", label: "Prefiro atividades fora da tela, como montar e construir coisas", weights: { construction: 4, practicalActivities: 4, robotics: 2 } },
    ],
  },
  {
    id: "q3",
    step: 3,
    title: "Quando aparece um desafio difícil, o que você prefere fazer?",
    options: [
      { id: "a", label: "Tentar descobrir como resolver, passo a passo", weights: { logicalReasoning: 5, problemSolving: 5, programming: 2 } },
      { id: "b", label: "Montar e testar diferentes coisas até funcionar", weights: { practicalActivities: 5, construction: 4, problemSolving: 3, robotics: 3 } },
      { id: "c", label: "Desenhar e imaginar uma solução", weights: { imagination: 5, drawing: 3, creativity: 4 } },
      { id: "d", label: "Procurar uma maneira criativa e diferente de fazer", weights: { creativity: 5, visualCreativity: 3, design: 3 } },
      { id: "e", label: "Pedir ajuda e seguir um exemplo", weights: { teamwork: 4, digitalAutonomy: 1 } },
    ],
  },
  {
    id: "q4",
    step: 3,
    title: "O que mais chama a sua atenção nessas atividades?",
    options: [
      { id: "a", label: "Montar peças e criar mecanismos que se movem", weights: { construction: 5, robotics: 4, fineMotorSkills: 3, practicalActivities: 4 } },
      { id: "b", label: "Ligar fios, sensores e luzes para ver algo acontecer", weights: { electronics: 5, robotics: 4, technology: 3 } },
      { id: "c", label: "Programar algo para funcionar sozinho, sem montar nada físico", weights: { programming: 5, logicalReasoning: 3, technology: 3 } },
      { id: "d", label: "Desenhar como a construção ficaria, em vez de montar de verdade", weights: { drawing: 4, design: 3, imagination: 3 } },
    ],
  },
  {
    id: "q5",
    step: 2,
    title: "Qual dessas atividades parece mais divertida pra você?",
    options: [
      { id: "a", label: "Desenhar um personagem novo, com roupa, cor e jeito próprio", weights: { drawing: 5, art: 4, imagination: 4, visualCreativity: 4 } },
      { id: "b", label: "Criar uma arte bonita para um cartaz, capa ou post", weights: { design: 5, aestheticSense: 5, visualCreativity: 4 } },
      { id: "c", label: "Inventar uma história e pensar no que acontece em cada parte dela", weights: { storytelling: 5, imagination: 4, creativity: 3 } },
      { id: "d", label: "Programar uma tela ou app com um visual bem organizado", weights: { programming: 4, technology: 3, design: 2 } },
    ],
  },
  {
    id: "q6",
    step: 2,
    title: "Se você fosse criar um curta-metragem ou uma animação, o que mais te animaria?",
    options: [
      { id: "a", label: "Criar os personagens e desenhar como eles se movem", weights: { drawing: 5, animation: 5, art: 3 } },
      { id: "b", label: "Escrever a história e decidir o que acontece em cada cena", weights: { storytelling: 5, imagination: 4, creativity: 3 } },
      { id: "c", label: "Cuidar dos detalhes: vozes, sons e o ritmo de cada cena", weights: { attentionToDetail: 4, digitalTools: 2, storytelling: 2 } },
      { id: "d", label: "Não curto muito essa ideia, prefiro outro tipo de projeto", weights: { creativity: 1 } },
    ],
  },
  {
    id: "q7",
    step: 4,
    title: "No computador, você já sabe fazer bem qual dessas coisas?",
    options: [
      { id: "a", label: "Criar e organizar documentos, textos ou apresentações", weights: { digitalProductivity: 5, digitalAutonomy: 4, digitalTools: 3 } },
      { id: "b", label: "Editar imagens, vídeos ou artes", weights: { digitalTools: 5, design: 3, visualCreativity: 3 } },
      { id: "c", label: "Escrever código ou usar programas de programação", weights: { programming: 5, logicalReasoning: 3, technology: 3 } },
      { id: "d", label: "Ainda estou aprendendo o básico, uso pouco o computador sozinho", weights: { digitalAutonomy: 1 } },
    ],
  },
  {
    id: "q8",
    step: 4,
    title: "Você gostaria de aprender a usar ferramentas para…",
    options: [
      { id: "a", label: "Ficar mais organizado e produtivo nos trabalhos da escola", weights: { digitalProductivity: 5, digitalAutonomy: 4, digitalTools: 3 } },
      { id: "b", label: "Criar jogos, sites ou aplicativos", weights: { programming: 5, technology: 4, projects: 3 } },
      { id: "c", label: "Criar artes, vídeos e conteúdos criativos", weights: { design: 4, digitalTools: 4, visualCreativity: 3, creativity: 3 } },
      { id: "d", label: "Montar e programar robôs e projetos físicos", weights: { robotics: 5, construction: 4, electronics: 3 } },
    ],
  },
  {
    id: "q9",
    step: 5,
    title: "Qual dessas frases combina mais com você?",
    options: [
      { id: "a", label: "Adoro jogar e também penso em como seria criar meu próprio jogo", weights: { games: 5, programming: 4, creativity: 3 } },
      { id: "b", label: "Gosto de jogar, mas não penso muito em como o jogo foi feito", weights: { games: 3, technology: 1 } },
      { id: "c", label: "Prefiro criar coisas a jogar", weights: { games: 1, creativity: 3, projects: 2 } },
      { id: "d", label: "Jogos não são muito a minha praia", weights: { teamwork: 1 } },
    ],
  },
  {
    id: "q10",
    step: 4,
    title: "Como você imagina usar a Inteligência Artificial?",
    options: [
      { id: "a", label: "Para me ajudar a programar e criar projetos mais rápido", weights: { artificialIntelligence: 5, programming: 4, technology: 3 } },
      { id: "b", label: "Para criar imagens, vídeos e conteúdos", weights: { artificialIntelligence: 5, design: 4, visualCreativity: 3 } },
      { id: "c", label: "Para estudar, pesquisar e organizar tarefas", weights: { artificialIntelligence: 5, digitalProductivity: 4, digitalAutonomy: 3 } },
      { id: "d", label: "Ainda não pensei muito sobre isso", weights: { artificialIntelligence: 1 } },
    ],
  },
  {
    id: "q11",
    step: 5,
    title: "Você aprende melhor quando…",
    options: [
      { id: "a", label: "Constrói e experimenta com as próprias mãos", weights: { practicalActivities: 5, construction: 4, fineMotorSkills: 3 } },
      { id: "b", label: "Desenha, imagina e visualiza as ideias", weights: { imagination: 5, drawing: 4, visualCreativity: 3 } },
      { id: "c", label: "Segue uma lógica, testa e corrige os próprios erros", weights: { logicalReasoning: 5, programming: 4, problemSolving: 4 } },
      { id: "d", label: "Cria um projeto do começo ao fim, sozinho ou em equipe", weights: { projects: 5, teamwork: 4, creativity: 3 } },
    ],
  },
  {
    id: "q12",
    step: 5,
    title: "Se você pudesse passar uma tarde inteira criando qualquer projeto, qual escolheria?",
    helper: "Pense no que faria você perder a noção do tempo.",
    options: [
      { id: "a", label: "Programar um jogo ou aplicativo criativo", weights: { programming: 5, games: 4, creativity: 3, technology: 4, projects: 4, challenges: 3 } },
      { id: "b", label: "Construir e programar um robô para cumprir uma missão", weights: { robotics: 5, construction: 5, electronics: 4, challenges: 4, problemSolving: 4 } },
      { id: "c", label: "Criar uma animação com personagens e uma história", weights: { animation: 5, drawing: 4, storytelling: 5, art: 3, imagination: 4 } },
      { id: "d", label: "Criar uma identidade visual, artes e posts incríveis", weights: { design: 5, visualCreativity: 5, aestheticSense: 4, creativity: 3 } },
      { id: "e", label: "Organizar um projeto usando as melhores ferramentas digitais e IA", weights: { digitalProductivity: 5, digitalTools: 5, digitalAutonomy: 4, artificialIntelligence: 3 } },
    ],
  },
];
