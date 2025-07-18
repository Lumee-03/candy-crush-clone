const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 8;
const squares = [];
let score = 0;
const colors = ['red', 'yellow', 'green', 'blue', 'orange', 'purple'];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    let color = getRandomColor();
    square.classList.add('square', color);
    grid.appendChild(square);
    squares.push(square);
  }
}
createBoard();

// Drag and drop
let colorBeingDragged, colorBeingReplaced;
let squareIdBeingDragged, squareIdBeingReplaced;

squares.forEach(square => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragend', dragEnd);
  square.addEventListener('dragover', e => e.preventDefault());
  square.addEventListener('dragenter', e => e.preventDefault());
  square.addEventListener('drop', dragDrop);
});

function dragStart() {
  colorBeingDragged = this.classList[1];
  squareIdBeingDragged = parseInt(this.id);
}

function dragDrop() {
  colorBeingReplaced = this.classList[1];
  squareIdBeingReplaced = parseInt(this.id);

  squares[squareIdBeingDragged].classList.remove(colorBeingDragged);
  squares[squareIdBeingDragged].classList.add(colorBeingReplaced);
  squares[squareIdBeingReplaced].classList.remove(colorBeingReplaced);
  squares[squareIdBeingReplaced].classList.add(colorBeingDragged);
}

function dragEnd() {
  let validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged + 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + width
  ];
  let validMove = validMoves.includes(squareIdBeingReplaced);

  if (!squareIdBeingReplaced || !validMove) {
    squares[squareIdBeingDragged].classList.remove(squares[squareIdBeingDragged].classList[1]);
    squares[squareIdBeingDragged].classList.add(colorBeingDragged);
    squares[squareIdBeingReplaced].classList.remove(squares[squareIdBeingReplaced].classList[1]);
    squares[squareIdBeingReplaced].classList.add(colorBeingReplaced);
  }

  squareIdBeingReplaced = null;
}

function checkRowForThree() {
  for (let i = 0; i < 61; i++) {
    let rowOfThree = [i, i + 1, i + 2];
    let decidedColor = squares[i].classList[1];
    const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55];
    if (notValid.includes(i)) continue;

    if (rowOfThree.every(idx => squares[idx].classList[1] === decidedColor)) {
      score += 3;
      scoreDisplay.textContent = 'Pontuação: ' + score;
      rowOfThree.forEach(idx => {
        squares[idx].classList.remove(decidedColor);
        squares[idx].classList.add(getRandomColor());
      });
    }
  }
}

function checkColumnForThree() {
  for (let i = 0; i < 47; i++) {
    let columnOfThree = [i, i + width, i + width * 2];
    let decidedColor = squares[i].classList[1];

    if (columnOfThree.every(idx => squares[idx].classList[1] === decidedColor)) {
      score += 3;
      scoreDisplay.textContent = 'Pontuação: ' + score;
      columnOfThree.forEach(idx => {
        squares[idx].classList.remove(decidedColor);
        squares[idx].classList.add(getRandomColor());
      });
    }
  }
}

function moveDown() {
  for (let i = 0; i < 56; i++) {
    if (!squares[i + width].classList[1]) {
      squares[i + width].classList.add(squares[i].classList[1]);
      squares[i].classList.remove(squares[i].classList[1]);
    }
  }

  for (let i = 0; i < width; i++) {
    if (!squares[i].classList[1]) {
      squares[i].classList.add(getRandomColor());
    }
  }
}

window.setInterval(() => {
  moveDown();
  checkRowForThree();
  checkColumnForThree();
}, 100);

