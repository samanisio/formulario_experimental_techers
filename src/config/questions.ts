import type { ProfileQuestion } from "../types";

// Perguntas situacionais do dia a dia — nenhuma pressupõe que o aluno já
// programou, já usou ferramentas digitais avançadas ou já conhece os cursos
// da TECHERS. Cada alternativa só altera dimensões do perfil (ver
// src/types.ts); nenhuma pergunta menciona o nome de um curso.
//
// Nesta versão, a letra da alternativa é a MESMA direção em todas as 10
// perguntas: a = Programação, b = Robótica, c = Animação Digital,
// d = Design Gráfico, e = Informática Moderna. A ordem de exibição, porém,
// é embaralhada em tempo de execução (ver src/engine/shuffle.ts, usado em
// App.tsx) — assim, mesmo sendo sempre a mesma direção internamente, a
// alternativa "a" nunca aparece necessariamente na mesma posição na tela,
// o que evita que quem responde no automático (sempre a primeira opção)
// sempre caia no mesmo curso.
//
// Desenho estrutural (importante para manter o equilíbrio entre cursos):
// cada pergunta oferece uma alternativa dedicada a cada um dos 5
// direcionamentos principais. Isso garante que TODOS os cursos apareçam com
// força parecida ao longo do formulário inteiro. O equilíbrio é verificado
// por simulação em scripts/balance-check.ts (não faz parte do app).
//
// Alternativas de Design Gráfico nunca mencionam "desenhar" — ver
// courses.ts > design-grafico (o curso não depende de desenho à mão livre).
// Alternativas de Animação Digital não se concentram só em "história" — o
// curso também é sobre movimento, expressão, dublagem e repetição/ajuste
// (ver courses.ts > animacao-digital).
//
// Para adicionar, remover ou reformular perguntas, edite somente este
// arquivo — o motor de recomendação e a barra de progresso se adaptam
// automaticamente ao número de perguntas.

export const questions: ProfileQuestion[] = [
  {
    id: "q1",
    title: "Se sua turma precisasse criar um projeto para apresentar em uma feira, qual atividade você escolheria?",
    options: [
      { id: "a", label: "Criar um jogo ou uma atividade interativa no computador", weights: { programming: 5, technology: 3, logicalReasoning: 2, games: 2 } },
      { id: "b", label: "Construir um robô ou mecanismo que possa se movimentar", weights: { robotics: 5, construction: 4, electronics: 3, practicalActivities: 2 } },
      { id: "c", label: "Criar um personagem e produzir uma pequena animação", weights: { animation: 5, drawing: 3, imagination: 2 } },
      { id: "d", label: "Criar um mural interativo temático da feira", weights: { design: 5, visualCreativity: 3, aestheticSense: 3, communication: 2 } },
      { id: "e", label: "Um catálogo digital de produtos ou projetos da feira", weights: { digitalProductivity: 5, digitalTools: 3, digitalAutonomy: 2 } },
    ],
  },
  {
    id: "q2",
    title: "Você ganhou uma caixa cheia de materiais (potes, fios, papelão, tecido, engrenagem, etc). O que você faria com ela?",
    options: [
      { id: "a", label: "Deixaria a caixa de lado e ficaria jogando no computador", weights: { games: 4, programming: 3, technology: 3 } },
      { id: "b", label: "Usaria o material para tentar montar um carrinho", weights: { construction: 5, robotics: 4, practicalActivities: 3, fineMotorSkills: 2 } },
      { id: "c", label: "Um bonequinho articulado que pudesse fazer poses diferentes", weights: { animation: 5, attentionToDetail: 3, imagination: 2 } },
      { id: "d", label: "Uma decoração ou escultura bem caprichada e bonita", weights: { design: 4, aestheticSense: 4, visualCreativity: 3, creativity: 2 } },
      { id: "e", label: "Organizaria tudo por tipo e cor", weights: { digitalProductivity: 3, attentionToDetail: 4, digitalAutonomy: 2 } },
    ],
  },
  {
    id: "q3",
    title: "Sua turma recebeu uma missão: resolver um mistério, tipo um jogo de detetive. Qual parte você ia querer fazer?",
    options: [
      { id: "a", label: "Organizar as pistas encontradas em ordem de acontecimentos", weights: { logicalReasoning: 5, programming: 2, problemSolving: 3 } },
      { id: "b", label: "Inventar e montar aparelhos que ajudassem a investigar o mistério", weights: { robotics: 4, construction: 4, problemSolving: 3, practicalActivities: 2 } },
      { id: "c", label: "Descrever a voz e o jeito de andar de cada suspeito", weights: { animation: 4, imagination: 3, attentionToDetail: 2 } },
      { id: "d", label: "Criar um mural com as pistas e todos os suspeitos", weights: { design: 4, visualCreativity: 4, aestheticSense: 3, visualCuration: 2 } },
      { id: "e", label: "Escrever um relatório do caso", weights: { digitalProductivity: 4, attentionToDetail: 4, digitalAutonomy: 2 } },
    ],
  },
  {
    id: "q4",
    title: "Se você ganhasse um computador ou tablet novo, o que teria mais vontade de descobrir primeiro?",
    options: [
      { id: "a", label: "Descobrir como fazer uma ideia que está na minha cabeça virar algo que realmente funciona", weights: { programming: 5, logicalReasoning: 3, projects: 2 } },
      { id: "b", label: "Fazer alguma coisa criada por mim obedecer a comandos e realizar tarefas sozinha", weights: { robotics: 5, technology: 3, electronics: 2 } },
      { id: "c", label: "Criar uma cena em que, de repente, tudo começa a acontecer e ganhar movimento", weights: { animation: 5, imagination: 3, drawing: 2 } },
      { id: "d", label: "Pegar várias coisas diferentes e combinar tudo até criar uma imagem que chame atenção", weights: { mediaEditing: 4, visualCreativity: 4, design: 3 } },
      { id: "e", label: "Descobrir maneiras de fazer minhas tarefas do dia a dia mais rápidas e fáceis", weights: { digitalProductivity: 5, digitalAutonomy: 3, digitalTools: 2 } },
    ],
  },
  {
    id: "q5",
    title: "Se você fosse criar um personagem para um jogo, o que mais te animaria fazer?",
    options: [
      { id: "a", label: "Fazer ele tomar decisões diferentes dependendo do que acontece ao redor", weights: { programming: 5, logicalReasoning: 4, games: 2 } },
      { id: "b", label: "Criar uma versão física dele usando impressão 3D", weights: { robotics: 4, construction: 3, technology: 3 } },
      { id: "c", label: "Decidir sua aparência, suas expressões e todos os seus jeitos de se movimentar", weights: { animation: 5, drawing: 3, imagination: 2 } },
      { id: "d", label: "Combinar elementos visuais para fazer todo mundo reconhecer o personagem de longe", weights: { design: 5, aestheticSense: 3, visualCreativity: 2 } },
      { id: "e", label: "Montar uma ficha com suas características e habilidades", weights: { digitalProductivity: 4, attentionToDetail: 3, digitalAutonomy: 2 } },
    ],
  },
  {
    id: "q6",
    title: "Se você pudesse escolher um superpoder, qual escolheria?",
    options: [
      { id: "a", label: "Superinteligência: pensar em soluções que ninguém mais conseguiu imaginar", weights: { logicalReasoning: 5, problemSolving: 4, programming: 2 } },
      { id: "b", label: "Controle de objetos: objetos obedecerem aos seus comandos", weights: { robotics: 5, technology: 3, electronics: 2 } },
      { id: "c", label: "Dar vida a desenhos: fazer com que personagens e desenhos tenham consciência", weights: { animation: 5, drawing: 3, imagination: 3 } },
      { id: "d", label: "Mudar a realidade: mudar as cores, formas e aparências do jeito que você quiser", weights: { design: 4, aestheticSense: 4, visualCreativity: 4 } },
      { id: "e", label: "Super velocidade: realizar tarefas de forma rápida e eficiente", weights: { digitalProductivity: 5, digitalAutonomy: 3, digitalTools: 2 } },
    ],
  },
  {
    id: "q7",
    title: "Se sua turma fosse gravar um vídeo para postar nas redes sociais da escola, qual parte você ia querer fazer?",
    options: [
      { id: "a", label: "Programar um efeito especial ou uma parte interativa do vídeo", weights: { programming: 3, technology: 4, logicalReasoning: 2 } },
      { id: "b", label: "Cuidar da parte técnica: câmera, luzes e os equipamentos", weights: { electronics: 3, technology: 4, practicalActivities: 3, robotics: 1 } },
      { id: "c", label: "Decidir a ordem das cenas e o ritmo de cada corte, tipo um diretor", weights: { animation: 3, attentionToDetail: 3, imagination: 2 } },
      { id: "d", label: "Editar o vídeo e criar a capa para chamar atenção", weights: { mediaEditing: 5, design: 2, communication: 2 } },
      { id: "e", label: "Organizar o cronograma de gravação e publicar tudo direitinho", weights: { digitalProductivity: 4, digitalAutonomy: 3, digitalTools: 3 } },
    ],
  },
  {
    id: "q8",
    title: "Imagine que você encontrou uma cidade onde tudo pode ser inventado por quem mora nela. Qual seria a primeira coisa que você gostaria de fazer?",
    options: [
      { id: "a", label: "Criar as regras que mudassem conforme as pessoas precisassem", weights: { programming: 4, logicalReasoning: 4, artificialIntelligence: 2 } },
      { id: "b", label: "Fazer com que tarefas chatas pudessem ser feitas sozinhas", weights: { robotics: 4, technology: 3, practicalActivities: 2 } },
      { id: "c", label: "Criar uma história que pudesse acontecer pelas ruas da cidade", weights: { storytelling: 4, imagination: 4, animation: 2 } },
      { id: "d", label: "Transformar lugares comuns em espaços que todo mundo tivesse vontade de conhecer", weights: { design: 4, aestheticSense: 4, visualCreativity: 3 } },
      { id: "e", label: "Descobrir uma maneira de facilitar alguma coisa que todo mundo naquela cidade faz todos os dias", weights: { digitalProductivity: 5, digitalAutonomy: 2, artificialIntelligence: 2 } },
    ],
  },
  {
    id: "q9",
    title: "Você aprende uma coisa nova melhor quando…",
    options: [
      { id: "a", label: "Segue um raciocínio lógico, passo a passo, testando e corrigindo erros", weights: { logicalReasoning: 5, programming: 3, problemSolving: 3 } },
      { id: "b", label: "Coloca a mão na massa: monta, testa e desmonta até entender", weights: { practicalActivities: 5, construction: 3, robotics: 2, problemSolving: 2 } },
      { id: "c", label: "Repete e ajusta várias vezes até o resultado ficar do jeito certo", weights: { attentionToDetail: 4, animation: 3, imagination: 2 } },
      { id: "d", label: "Observa um exemplo bem feito e se inspira nele", weights: { visualCuration: 5, aestheticSense: 3, design: 2 } },
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
