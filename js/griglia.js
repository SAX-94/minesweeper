const gridContainer = document.querySelector(".grid-container");

// creare una griglia 8x8 con delle celle grandi 50pxx50px
// serve un ciclo per creare le celle (8*8, 3*3, 9*9)
// creiamo un div per ogni singola cella
// appendo la cella al suo contenitore (grid-container)

/**
 * Genera un numero random compreso tra un minimo ed un massimo
 *
 * @param {*} min
 * @param {*} max
 */
function generateRandomNumbers(min, max = 10) {
  if (min === undefined || min === null || min < 0) {
    // min = 0;
    return;
  }

  if (max === undefined || max < min + 1) {
    max = min + 10;
    // return
  }

  const result = Math.floor(Math.random() * (max - min + 1)) + min;

  return result;
}

function generateUniqueRandomNumbers(min, max, listaNumeriGiaGenerati) {
  let numeroRandom;

  do {
    numeroRandom = generateRandomNumbers(min, max);
  } while (listaNumeriGiaGenerati.includes(numeroRandom));

  return numeroRandom;
}

function onCellClick() {
  // Come faccio a capire il div che ho cliccato?

  // this = l'elemento che ha generato l'evento usato nel addEventListener
  console.log("hai cliccato il numero", this.innerText);

  const numero = parseInt(this.innerText);

  if (numero % 2 === 0) {
    this.classList.add("even");
  } else {
    this.classList.add("odd");
  }
}

/**
 *
 * @param {number} xCells - Numero di celle da creare in orizzontale
 * @param {number} yCells - Numero di celle da creare in verticale
 */
function createGrid(xCells, yCells) {
  // this = window

  // quantità di celle da creare
  const cellsNumber = xCells * yCells;

  console.log(cellsNumber);

  gridContainer.style.width = `calc(var(--cell-size) * ${xCells})`;

  // variabile dove inserire i numeri random generati
  const numeriGenerati = [];

  // creo ogni singola cella necessaria
  for (let i = 0; i < cellsNumber; i++) {
    const randomNumber = generateUniqueRandomNumbers(1, 100, numeriGenerati);
    numeriGenerati.push(randomNumber);

    // creare un div che rappresenta una singola cella
    const cell = document.createElement("div");
    cell.classList.add("cell");
    // cell.append(randomNumber.toString());
    cell.innerHTML = `<span>${randomNumber}</span>`;

    // Aggiungo un event listener sul click della cella
    // cell.addEventListener("click", onCellClick);
    cell.addEventListener("click", function () {
      // Come faccio a capire il div che ho cliccato?

      // this = l'elemento che ha generato l'evento usato nel addEventListener
      console.log("hai cliccato il numero", this.innerText);

      const numero = parseInt(this.innerText);

      if (numero % 2 === 0) {
        this.classList.add("even");
      } else {
        this.classList.add("odd");
      }
    });

    gridContainer.append(cell);
  }
}

createGrid(8, 8);
