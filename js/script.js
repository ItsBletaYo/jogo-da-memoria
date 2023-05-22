const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items
const items = [
  { name: "bee", image: src= "images/bee.png" },
  { name: "crocodile", image: src= "images/crocodile.png" },
  { name: "macaw", image: src= "images/macaw.png" },
  { name: "gorilla", image: src= "images/gorilla.png" },
  { name: "tiger", image: src= "images/tiger.png" },
  { name: "monkey", image: src= "images/monkey.png" },
  { name: "chameleon", image: src= "images/chameleon.png" },
  { name: "piranha", image: src= "images/piranha.png" },
  { name: "anaconda", image:src= "images/anaconda.png" },
  { name: "sloth", image: src= "images/sloth.png" },
  { name: "cockatoo", image: src= "images/cockatoo.png" },
  { name: "toucan", image: src= "images/toucan.png" },
];

//Tempo Inicial
let seconds = 0,
  minutes = 0;
//Movimentos iniciais e contagem de vitórias
let movesCount = 0,
  winCount = 0;

//Temporizador
const timeGenerator = () => {
  seconds += 1;
  //Lógica de minutos
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //Formatar hora antes de exibir
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Tempo: </span>${minutesValue}:${secondsValue}`;
};

//Para calcular movimentos
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Movimentos: </span>${movesCount}`;
};

//Escolher objetos aleatórios da matriz de itens
const generateRandom = (size = 4) => {
  //matriz temporária
  let tempArray = [...items];
  //inicializa a matriz cardValues
  let cardValues = [];
  //o tamanho deve ser duplo (matriz 4*4)/2, pois existiriam pares de objetos
  size = (size * size) / 2;
  //Seleção aleatória de objetos
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //Uma vez selecionado, remove o objeto da matriz temporária
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //embaralhamento simples
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Criar Cartas
        Antes => frente (contém ponto de interrogação)
        Depois => verso (contém a imagem real);
        data-card-values ​​é um atributo personalizado que armazena os nomes dos cartões para correspondência posterior
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grade
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cartas
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Se o cartão selecionado ainda não for correspondido, apenas execute (ou seja, o cartão já correspondido quando clicado será ignorado)
      if (!card.classList.contains("matched")) {
        //vira a carta clicada
        card.classList.add("flipped");
        //se for a firstcard (!firstCard já que firstCard é inicialmente falso)
        if (!firstCard) {
          //então a carta atual se tornará a primeiraCarta
          firstCard = card;
          //o valor atual das cartas se torna firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //movimentos de incremento desde que o usuário selecionou a segundo carta
          movesCounter();
          //segundaCarta e valor
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //se ambos os cartões corresponderem, adicione a classe correspondente para que esses cartões sejam ignorados na próxima vez
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //defina firstCard como falso, pois o próximo cartão seria o primeiro agora
            firstCard = false;
            //incremento de winCount conforme o usuário encontrou uma correspondência correta
            winCount += 1;
            //verifique se winCount == metade de cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>Você Ganhou!</h2>
            <h4>Movimentos: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //se as cartas não combinarem
            //vire as cartas de volta ao normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Começar o jogo
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //visibilidade de controles e botões
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Iniciar cronômetro
  interval = setInterval(timeGenerator, 1000);
  //movimentos iniciais
  moves.innerHTML = `<span>Movimentos:</span> ${movesCount}`;
  initializer();
});

//Parar o jogo
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);
//Inicializar valores e chamadas de função
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

function playSound(wrapper) {
  var audio = new Audio('./js/audio/click.mp3')
  audio.play();
}
