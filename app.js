document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const cruiser = document.querySelector('.cruiser-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');
    const startButton = document.querySelector('#start');
    const rotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#whose-go');
    const infoDisplay = document.querySelector('#info');
    const userSquares = [];
    const computerSquares = [];
    const width = 10;
    let isHorizontal = true;

    //Create boards
    function createBoard(grid, squares) {
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square);
        }
    }

    //Create divs inside user and computer grids
    createBoard(userGrid, userSquares);
    createBoard(computerGrid, computerSquares);

    //Ships array of objects

    const shipArray = [
        {
            name: 'destroyer',
            directions: [
                [0, 1], //horizontal div with index  0 and 1
                [0, width] //vertical div with index 0 and 10
            ]
        },
        {
            name: 'submarine',
            directions: [
              [0, 1, 2],
              [0, width, width*2]
            ]
        },
        {
            name: 'cruiser',
            directions: [
              [0, 1, 2],
              [0, width, width*2]
            ]
        },
        {
            name: 'battleship',
            directions: [
              [0, 1, 2, 3],
              [0, width, width*2, width*3]
            ]
          },
          {
            name: 'carrier',
            directions: [
              [0, 1, 2, 3, 4],
              [0, width, width*2, width*3, width*4]
            ]
          },
    ]

    //Draw computer ships in random locations
    function generate(ship) {
        //random direction always will be a number between 0 or 1
        let randomDirection = Math.floor(Math.random() * ship.directions.length); 
        //choose current ships that is generated direction
        let current = ship.directions[randomDirection]; 
       
        if (randomDirection === 0) direction = 1;
        if (randomDirection === 1) direction = 10;
        //Create random ship start square (will be less than 100 always) - if direction is downward it will always minus enough squares from the bottom
        let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)));

        //check that squares are not taken or are not on right or left edge
        const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'));
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1); //remainder will always be 9 on the right edge
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0); // will always be 0 on the left edge

        //if all above are false generate ship (add class 'taken' and ships name class to each square)
        if(!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name));

        else generate(ship);
    }

  generate(shipArray[0]);
  generate(shipArray[1]);
  generate(shipArray[2]);
  generate(shipArray[3]);
  generate(shipArray[4]);


  //rotate ships
  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = false;
      console.log(isHorizontal);
    } else {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = true;
      console.log(isHorizontal);
    }
  }

  rotateButton.addEventListener('click', rotate);

//drag and drop user ships
ships.forEach(ship => ship.addEventListener('dragstart', dragStart));
userSquares.forEach(square => square.addEventListener('dragstart', dragStart));
userSquares.forEach(square => square.addEventListener('dragover', dragOver));
userSquares.forEach(square => square.addEventListener('dragenter', dragEnter));
userSquares.forEach(square => square.addEventListener('dragleave', dragLeave));
userSquares.forEach(square => square.addEventListener('drop', dragDrop));
userSquares.forEach(square => square.addEventListener('dragend', dragEnd));

let selectedShipNameWithIndex;
let draggedShip;
let draggedShipLength;

//on mouse click get the id of the square within the ship 
ships.forEach(ship => ship.addEventListener('mousedown', (event) => {
  selectedShipNameWithIndex = event.target.id;
  console.log(selectedShipNameWithIndex);
}))

function dragStart(event) {
  draggedShip = event.target;
  draggedShipLength = event.target.children.length;
  console.log(draggedShipLength);
}

function dragOver(event) {
 event.preventDefault();
 //console.log('drag over');
}

function dragEnter(event) {
  event.preventDefault();
  //console.log('drag enter');
}

function dragLeave() {
  event.preventDefault();
 // console.log('drag leave');
}

function dragDrop() {
  //get id of the dragged ship last div(square), extract number of that div and class name 
  let shipNameWithLastId = draggedShip.lastElementChild.id
  console.log(shipNameWithLastId);
  let shipClass = shipNameWithLastId.slice(0, -2)
  console.log(shipClass);
  let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
  console.log('last ship index' + lastShipIndex);
  //to get which exact square on the grid the tail of our ship will be on
  let shipLastId = lastShipIndex + parseInt(this.dataset.id);
  //account for ships wrapping around to the next row when its in horizontal or next column when in vertical position by creating an array 
  //of forbbiden squares
  const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93];
  const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60];
  //depending on ships length we only want to limit the correct amount of squares on a grid
  let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
  let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);
  //get selected ship last square index number
  let selectedShipIndex = (selectedShipNameWithIndex.substr(-1));
  //we have to correct shipLastId depending on which square we dragging our ship by so it shows the correct square on a grid always
  shipLastId -= parseInt(selectedShipIndex);
  console.log(this.dataset.id);

  if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
    //loop through user squares array and add classess taken and ship name class, correct starting square position on a grid 
    //by substractig id of the square by which we are dragging the ship into place
    for (let i = 0; i < draggedShipLength; i++) {
      userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
    }
  } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
    for (let i = 0; i < draggedShipLength; i++) {
      userSquares[parseInt(this.dataset.id) - (selectedShipIndex * width) + (i * width)].classList.add('taken', shipClass);  
    } 
    } else return;
  
displayGrid.removeChild(draggedShip);

}

function dragEnd() {
  // console.log('dragend')
}

})