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
    createBoard(computerGrid, computerSquares, width);

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

})