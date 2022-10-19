/*
Avere una griglia grande N x N
al click su una cella della griglia, devo controllare se è una bomba
- se si il gioco finisce,
- altrimenti l'utente può cliccare su un altra cella
*/

/*
STEP DA FARE:
- creo una funzione che mi genera una griglia di 8 x 8;
  - creo un array con X numeri random che rappresentano le mie bombe;
    - per fare questo, creo una funzione che genera i numeri random, unici!!
  - creo una variabile dove salvare il numero totale di celle da creare
  - in base al numero di celle da creare, tramite un ciclo
    - creo l'html di ogni singola cella
    - appendo l'html alla griglia
    - aggiungo alla cella create un eventListener sul click
      - al click, controllo se la cella è una bomba
        - il numero (indice) della cella cliccata, fa parte dell'array delle bombe?
          - se si, è una bomba, mostro un alert che dice che hai perso
          - altrimenti, non è una bomba, l'utente continua a giocare
*/

let punteggio = 0;
let gameOver = false;

const btnNewGame = document.getElementById("btn-new-game");
const pointsElement = document.getElementById("points");
const timesElement = document.getElementById("time");
const gridContainer = document.querySelector(".grid-container");

/**
 * @type {HTMLSelectElement}
 */
const difficultyLevel = document.querySelector("[name='difficultyLevel']");

let timer;

// Al click sul pulsante "Nuova partita"
// dobbiamo resettare il punteggio e la griglia
btnNewGame.addEventListener("click", function () {
  punteggio = 0;
  gameOver = false;
  updatePoints(false);

  generateGrid();
  updateTime(true, true);
});

/**
 * Genera un array con X numeri random, unici
 */
function generateBombsList(maxNumber, maxBombsNumber = 16) {
  const bombsList = [];

  do {
    // Creo il numero random
    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;

    // SOLO se questo non esiste ancora nel mio array, lo aggiungo
    if (!bombsList.includes(randomNumber)) {
      bombsList.push(randomNumber);
    }
  } while (bombsList.length < maxBombsNumber);

  return bombsList;
}

/**
 * Genera una griglia di 8 x 8
 * con le sue eventuali bombe
 */
function generateGrid() {
  // easy || medium || hard
  const chosenLevel = difficultyLevel.value;

  // if (chosenLevel === "easy") {
  // } else if (chosenLevel === "medium") {
  // } else if (chosenLevel === "hard") {
  // }

  // Numero totale di celle da creare
  let totCells;
  let totBombs;

  switch (chosenLevel) {
    case "easy":
      // creo 100 celle
      // Bombe 16
      totCells = 100;
      totBombs = 16;
      break;
    case "medium":
      // creo 81 celle
      // Bombe 14
      totCells = 81;
      totBombs = 14;
      break;
    case "hard":
      // creo 49 celle
      // Bombe 12
      totCells = 49;
      totBombs = 12;
      break;
  }

  // Lista con le bombe. Ad ogni bomba corrisponde un numero
  const bombsList = generateBombsList(totCells, totBombs);

  console.log(bombsList);

  // Stampa in html la griglia
  renderGrid(totCells, bombsList, chosenLevel);
}

/**
 * Stampa in html la grigia
 */
function renderGrid(totCells, bombsList, levelClass) {
  gridContainer.innerHTML = "";
  gridContainer.style.display = "flex";

  // Per sicurezza, prima rimuovo eventuali classi esistenti relative al livello
  gridContainer.classList.remove("easy", "medium", "hard", "explode");

  // Aggiungo una classe che indica il livello di difficoltà scelto
  gridContainer.classList.add(levelClass);

  // Ciclo che crea il numero di celle richiesto
  for (let i = 1; i <= totCells; i++) {
    // creo una singola cella html
    const cell = document.createElement("div");
    cell.classList.add("cell");
    // cell.textContent = i;

    // creerà un attributo "data-indice" che conterrà il numero della cella
    cell.dataset.indice = i;

    // Volendo possiamo aggiungere un attributo "data-bomb" ad una cella che
    // é una bomba, ma non avrebbe molto senso farlo visto che il player potrebbe barare
    /* if (bombsList.includes(i)) {
      cell.dataset.bomb = true;
    } */

    // Aggiungo tutti gli eventi necessari alla mia cella
    addCellEventListeners(cell, bombsList);

    // Aggiungo la cella alla griglia
    gridContainer.append(cell);
  }
}

/**
 * Informa l'utente che il gioco è finito
 * - mostrare il punteggio
 * - mostrare un overlay sopra la griglia
 * - se ha vinto potrebbe mostrare i coriandoli
 */
function informGameOver() {
  updateTime(false);
  gridContainer.classList.add("explode");

  alert("Il gioco è finito. Hai totalizzato " + punteggio + " punti");
}

/**
 * Data una cella, ne aggiunge tutti gli eventi
 */
function addCellEventListeners(cell, bombsList) {
  // Aggiungo l'eventListener al click tasto SX del mouse sulla cella
  cell.addEventListener("click", function () {
    // const cellIndex = parseInt(this.dataset.indice)

    // Controllo se la cella cliccata ha la classe bomb, non faccio nulla
    if (
      this.classList.contains("bomb") || // Se la cella cliccata ha la classe bomb
      this.classList.contains("clicked") || // Se la cella cliccata è già stata cliccata
      gameOver // Se il gioco è finito
    ) {
      // Evito che il click faccia il suo corso.
      return;
    }

    // il + davanti ad una variabile o valore, lo converte in numero
    const cellIndex = +this.dataset.indice;

    // Per sicurezza, rimuovo la classe flag per evitare conflitti con la classe bomb
    cell.classList.remove("flag");
    cell.classList.add("clicked");

    // Controllo se il numero della cella cliccata fa parte della lista delle bombe
    if (bombsList.includes(cellIndex)) {
      cell.classList.add("bomb");

      // Impostiamo a true la variabile gameOver in modo da indicare che l'utente ha perso
      gameOver = true;

      unveilBombs(bombsList);

      informGameOver();
    } else {
      // Se non è una bomba, è un punto per l'utente, quindi lo incremento
      updatePoints();
    }

    console.log("cliccato cella", cellIndex);
  });

  // click con tasto DX del mouse su una cella
  cell.addEventListener("contextmenu", function (e) {
    e.preventDefault();

    this.classList.toggle("flag");
  });

  cell.addEventListener("keyup", onCellKeyUp);
}

function onCellKeyUp() {}

function unveilBombs(bombsList) {
  console.log(bombsList);
  // partendo dalla lista delle bombe
  // devo cercare le celle che corrispondono a quelle bombe
  // e aggiungere la classe bomb

  for (let i = 0; i < bombsList.length; i++) {
    const bombNumber = bombsList[i];

    //                                   [data-indice='43']
    // const cell = document.querySelector("[data-indice='" + bombNumber + "']");
    const cell = document.querySelector(`[data-indice='${bombNumber}']`);

    if (!cell.classList.contains("bomb")) {
      cell.classList.add("bomb", "unveil");
    }
  }
}

function updatePoints(increment = true) {
  if (increment) {
    punteggio++;
  }

  pointsElement.textContent = punteggio.toString().padStart(3, "0");
}

function updateTime(start = true, reset = false) {
  if (timer) {
    clearInterval(timer);
  }

  if (reset) {
    timesElement.textContent = "000";
  }

  if (start) {
    let currentTime = 1;

    timer = setInterval(() => {
      const seconds = (currentTime % 60).toString().padStart(2, "0");
      const minutes = Math.floor(currentTime / 60);

      timesElement.textContent = (minutes + "" + seconds)
        .toString()
        .padStart(3, "0");
      currentTime++;
    }, 1000);
  }
}
