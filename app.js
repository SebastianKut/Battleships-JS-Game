document.addEventListener('DOMContentLoaded', function() {

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
    const playAgainButton = document.querySelector('#play-again');
    const turnDisplay = document.querySelector('#whose-go');
    const infoDisplay = document.querySelector('#info');
    let userSquares = [];
    let computerSquares = [];
    const width = 10;
    const hitSound = document.querySelector('#hit-sound');
    const missSound = document.querySelector('#miss-sound');
    const beginSound = document.querySelector('#start-sound');
    const endSound = document.querySelector('#end-sound');
    const openingButton = document.querySelector('.opening');
    const singlePlayer = document.querySelector('.single-player');
    let isHorizontal = true;
    let isGameOver = false;
    let currentPlayer = 'user';

    openingButton.addEventListener('click', startSinglePlayer);

    function startSinglePlayer() {
      beginSound.load();
      beginSound.autoplay = true;
      beginSound.loop = true;
      singlePlayer.style.display = 'block';
      openingButton.style.display = 'none';
    }
    

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
        //random direction (always will be a number between 0 or 1)
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

        //if all above are false generate ship by adding relevant classes
        if(!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name));

        else generate(ship);
    }

  generate(shipArray[0]);
  generate(shipArray[1]);
  generate(shipArray[2]);
  generate(shipArray[3]);
  generate(shipArray[4]);


  //rotate ships by manipulating css (toggle css class)
  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = false;
    } else {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = true;
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
}

function dragEnter(event) {
  event.preventDefault();
}

function dragLeave() {
  event.preventDefault();
}

function dragDrop() {
  //get id of the dragged ship last div(square), extract number of that div and class name 
  let shipNameWithLastId = draggedShip.lastElementChild.id
  let shipClass = shipNameWithLastId.slice(0, -2)
  let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));

  //get which exact square on the grid the tail of our ship will be on - depends on position
  let shipLastId;
  if (isHorizontal) {
    shipLastId = lastShipIndex + parseInt(this.dataset.id);
  };
  if (!isHorizontal) {
    shipLastId = (lastShipIndex * width) + parseInt(this.dataset.id);
  }
  //account for ships wrapping around to the next row when its in horizontal or next column when in vertical position by creating an array 
  //of forbbiden squares
  const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93];
  //depending on ships length we only want to limit the correct amount of squares on a grid
  let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
  //get selected ship last square index number
  let selectedShipIndex = (selectedShipNameWithIndex.substr(-1));
  //we have to correct shipLastId depending on which square we dragging our ship by so it shows the correct square on a grid always
  if (isHorizontal) {
    shipLastId = shipLastId - parseInt(selectedShipIndex);
  };
  if (!isHorizontal) {
    shipLastId = shipLastId - parseInt(selectedShipIndex * width);
  }

   //check if ship can be dropped to the user grid:
  //Horizontal position calculations
  let areaIsEmpty = true;
  if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
    //check if area is empty
    for (let i = 0; i < draggedShipLength; i++) {
        if (userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.contains('taken')) areaIsEmpty = false;
      };
    //loop through user squares array and add classess taken and ship name class, correct starting square position on a grid 
    //by substractig id of the square by which we are dragging the ship into place
    if (areaIsEmpty) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
      }
    } else return; 

  //Vertical position calculations
  } else if (!isHorizontal && shipLastId <= 99) {
    //check if area in the grid we wanna drop in is empty
    for (let i = 0; i < draggedShipLength; i++) {
      if (userSquares[parseInt(this.dataset.id) - (selectedShipIndex * width) + (i * width)].classList.contains('taken')) areaIsEmpty = false;
    };
    //drop ship if its empty
    if (areaIsEmpty) {
        for (let i = 0; i < draggedShipLength; i++) {
          userSquares[parseInt(this.dataset.id) - (selectedShipIndex * width) + (i * width)].classList.add('taken', shipClass);   
        } 
      } else return; 
    } else return;
  
//each time ship is moved to the grid remove it from display grid and show start button when all ships dragged to the user grid    
displayGrid.removeChild(draggedShip);
if (displayGrid.children.length === 0) showStartButton(); 
}

function showStartButton() {
  startButton.addEventListener('click', playGame);
  startButton.style.display = 'inline-block';
  displayGrid.style.display = 'none';
  rotateButton.style.display = 'none';
  infoDisplay.innerHTML = '';
}

//part of drag and drop events
function dragEnd() {
}

//Game Logic
function playGame() {
  
  beginSound.pause();
 
  
  turnDisplay.style.display = 'block';
  startButton.style.display = 'none';

  if (isGameOver) return;

  if (currentPlayer === 'user') {
    turnDisplay.style.color = '#F3DE8A';
    turnDisplay.innerHTML = 'FIRE!';
    computerSquares.forEach(square => square.addEventListener('click', playerGo));
  };

  if (currentPlayer === 'computer') {
    computerSquares.forEach(square => square.removeEventListener('click', playerGo));
    turnDisplay.style.color = 'transparent';
    turnDisplay.innerHTML = 'Computers Go';
    setTimeout(computerGo, 1000);
  }
}

startButton.addEventListener('click', playGame);

let destroyerCount = 0
let submarineCount = 0
let cruiserCount = 0
let battleshipCount = 0
let carrierCount = 0

function playerGo(event) {
  
  //make sure that clicking on the field that was already clicked doesnt count as turn
  if (!(event.target.classList.contains('boom') || event.target.classList.contains('miss'))) {
    //logic to check when ship sinks
    if (event.target.classList.contains('destroyer')) destroyerCount++;
    if (event.target.classList.contains('submarine')) submarineCount++;
    if (event.target.classList.contains('cruiser')) cruiserCount++;
    if (event.target.classList.contains('battleship')) battleshipCount++;
    if (event.target.classList.contains('carrier')) carrierCount++;
    //logic to check if hit / miss
    if (event.target.classList.contains('taken')) {
      event.target.classList.add('boom');
      event.target.classList.add('animate__bounceIn');
      //play sound
      hitSound.pause();
      hitSound.currentTime = 0;
      hitSound.play();  
    } else {
      event.target.classList.add('miss');
      event.target.classList.add('animate__bounceIn');
      //playSound
      missSound.pause();
      missSound.currentTime = 0;
      missSound.play();  
    };
    currentPlayer = 'computer';
  } else return;
  checkForWins();
  playGame();
}

let cpuDestroyerCount = 0
let cpuSubmarineCount = 0
let cpuCruiserCount = 0
let cpuBattleshipCount = 0
let cpuCarrierCount = 0

function computerGo() {
  let random = Math.floor(Math.random() * userSquares.length);
  
  if (!(userSquares[random].classList.contains('boom') || userSquares[random].classList.contains('miss'))) {
   
    if (userSquares[random].classList.contains('destroyer')) cpuDestroyerCount++;
    if (userSquares[random].classList.contains('submarine')) cpuSubmarineCount++;
    if (userSquares[random].classList.contains('cruiser')) cpuCruiserCount++;
    if (userSquares[random].classList.contains('battleship')) cpuBattleshipCount++;
    if (userSquares[random].classList.contains('carrier')) cpuCarrierCount++;

    if (userSquares[random].classList.contains('taken')) {
      userSquares[random].classList.add('boom');
      userSquares[random].classList.add('animate__bounceIn');
      hitSound.pause();
      hitSound.currentTime = 0;
      hitSound.play(); 
    } else {
      userSquares[random].classList.add('miss');
      userSquares[random].classList.add('animate__bounceIn');
      missSound.pause();
      missSound.currentTime = 0;
      missSound.play();  
    };
    currentPlayer = 'user';
  } else computerGo();
  checkForWins()
  playGame();
}

function checkForWins() {

  function hideInfo() {
    infoDisplay.innerHTML='';
  } 

  if (destroyerCount === 2) {
    infoDisplay.style.color = 'lightgreen';
    infoDisplay.innerHTML = 'You destroyed the enemies\' destroyer';
    setTimeout(hideInfo, 1000);
    destroyerCount = 10;
  }
  if (submarineCount === 3) {
    infoDisplay.style.color = 'lightgreen';
    infoDisplay.innerHTML = `You destroyed the enemies\' submarine`;
    setTimeout(hideInfo, 1000);
    submarineCount = 10;
  }
  if (cruiserCount === 3) {
    infoDisplay.style.color = 'lightgreen';
    infoDisplay.innerHTML = `You destroyed the enemies\' cruiser`;
    setTimeout(hideInfo, 1000);
    cruiserCount = 10;
  }
  if (battleshipCount === 4) {
    infoDisplay.style.color = 'lightgreen';
    infoDisplay.innerHTML = `You destroyed the enemies\' battleship`;
    setTimeout(hideInfo, 1000);
    battleshipCount = 10;
  }
  if (carrierCount === 5) {
    infoDisplay.style.color = 'lightgreen';
    infoDisplay.innerHTML = `You destroyed the enemies\' carrier`;
    setTimeout(hideInfo, 1000);
    carrierCount = 10;
  }
  if (cpuDestroyerCount === 2) {
    infoDisplay.style.color = 'red';
    infoDisplay.innerHTML = `The enemy destroyed your destroyer`;
    setTimeout(hideInfo, 1000);
    cpuDestroyerCount = 10;
  }
  if (cpuSubmarineCount === 3) {
    infoDisplay.style.color = 'red';
    infoDisplay.innerHTML = `The enemy destroyed your submarine`;
    setTimeout(hideInfo, 1000);
    cpuSubmarineCount = 10;
  }
  if (cpuCruiserCount === 3) {
    infoDisplay.style.color = 'red';
    infoDisplay.innerHTML = `The enemy destroyed your cruiser`;
    setTimeout(hideInfo, 1000);
    cpuCruiserCount = 10;
  }
  if (cpuBattleshipCount === 4) {
    infoDisplay.style.color = 'red';
    infoDisplay.innerHTML = `The enemy destroyed your battleship`;
    setTimeout(hideInfo, 1000);
    cpuBattleshipCount = 10;
  }
  if (cpuCarrierCount === 5) {
    infoDisplay.style.color = 'red';
    infoDisplay.innerHTML = `The enemy destroyed your carrier`;
    setTimeout(hideInfo, 1000);
    cpuCarrierCount = 10;
  }

  if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
    infoDisplay.style.color = 'lightgreen';
    infoDisplay.innerHTML = 'YOU WIN';
    gameOver();
  }

  if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
    infoDisplay.style.color = 'red';
    infoDisplay.innerHTML = 'COMPUTER WINS';
    gameOver();
  }

}

function gameOver() {
  isGameOver = true;
  playAgainButton.style.display = 'inline-block';
  playAgainButton.addEventListener('click', reset);
  startButton.removeEventListener('click', playGame);
  computerSquares.forEach(square => square.removeEventListener('click', playerGo));
  turnDisplay.style.color = 'transparent';
  beginSound.pause();
  endSound.pause();
  endSound.currentTime = 0;
  endSound.play();
}

function reset() {
  location.reload();  
}


});