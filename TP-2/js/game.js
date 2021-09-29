export { Game };

import { GameBoard } from "./gameBoard.js";
import { Token } from "./token.js";

/**
 * @typedef SquareCoordinate
 * @prop {number} x1 the lowest  x position of the square
 * @prop {number} x2 the highest x position of the square  
 * @prop {number} y1 the lowest  y position of the square
 * @prop {number} y2 the highest y position of the square
 */

/** The Game class */
class Game {
    #gameBoard;
    #player1;
    #player2;
    #canvas;
    #height;
    #width;
    #timer;
    #ctx;

    /**
     * Constructor
     * @param {GameBoard} gameBoard The num of tile in x axis
     * @param {HTMLCanvasElement}  canvas The token background image 
     * @param {number}    timer The maximum time the game can last, expressed in seconds 
     */
    constructor(canvas, timer = 600) { 
        // this.#gameBoard = new GameBoard;
        this.#player1   = []; // Arreglo de fichas   
        this.#player2   = []; // Arreglo de fichas
        this.#canvas    = canvas;
        this.#height    = canvas.height;
        this.#width     = canvas.width;
        this.#timer     = timer;
        this.#ctx       = canvas.getContext('2d');
    }

    #calculateSize(tileNum) {
        let gameBoardIsHorizontal =  this.#width > this.#height;
        let minSize = gameBoardIsHorizontal ? this.#height : this.#width;
        let maxSize = gameBoardIsHorizontal ? this.#width  : this.#height;
        let tileSize = minSize / tileNum;
        let gameBoardSize = (tileSize * tileNum);

        let gameBoardSquareCoordinate = {
            x1: (gameBoardIsHorizontal ?  ((maxSize - gameBoardSize)/2) : 0), 
            x2: (gameBoardIsHorizontal ? (((maxSize - gameBoardSize)/2) + gameBoardSize) : gameBoardSize), 
            y1: 0,
            y2: gameBoardSize,
        };

        let player1SquareCoordinate = {
            x1: 0,
            x2: (gameBoardIsHorizontal ? gameBoardSquareCoordinate.x1 : this.#width/2),
            y1: (gameBoardIsHorizontal ? 0 : gameBoardSize),
            y2: this.#height 
        };

        let player2SquareCoordinate = {
            x1: (gameBoardIsHorizontal ? gameBoardSquareCoordinate.x2 : this.#width/2),
            x2: this.#width,
            y1: (gameBoardIsHorizontal ? 0 : gameBoardSize),
            y2: this.#height 
        };
        return {tileSize, gameBoardSquareCoordinate, player1SquareCoordinate, player2SquareCoordinate};
    }

    #instantiateObjects(tileNum, lineTokenNumber, player1Color, player2Color, img) {
        tileNum =  (tileNum < lineTokenNumber) ? lineTokenNumber : tileNum; 
        let {tileSize, gameBoardSquareCoordinate, player1SquareCoordinate, player2SquareCoordinate} = this.#calculateSize(tileNum);

        let instantiateToken = (cant, player, coordinates, color, img) => {
            for (let i = 0; i < cant; i++) {
                let token = new Token(coordinates, color, img, (tileSize - 1) / 2, canvas.getContext('2d')); 
                player.push(token);
                token.draw()
            }
        };

        let numPlyaerToken = (tileNum * tileNum)/2;

        instantiateToken(numPlyaerToken, this.#player1, player1SquareCoordinate, player1Color, img);
        instantiateToken(numPlyaerToken, this.#player2, player2SquareCoordinate, player2Color, img);

        this.#gameBoard =  new GameBoard(gameBoardSquareCoordinate, tileNum, tileNum, tileSize, lineTokenNumber, null, tileSize, this.#canvas.getContext('2d'));

    }

    /** 
     *  Start the game
     *  When a winner is found, or time is up, or there is a player without chips, it calls to endGame 
     */
    startGame(tileNum, lineTokenNumber, player1Color, player2Color, img) { 
        this.#instantiateObjects(tileNum, lineTokenNumber, player1Color, player2Color, img);
    }
    
    /** 
     *  Finish the game
     *  Inform who is the winner  
     */
    #endGuego() {  }
    
    /** 
     *  Restart the game
     */
    restartGame() {  }
    
    /**
     * Select a token with the x and y mouese coordiantes
     * @param {number} x The x position of the token 
     * @param {number} y The y position of the token 
     */
    #selectToken(x, y) {  }

    /** 
     * Añade una ficha al tablero si es posible
     * @param {Token} token The token to add to the game board 
     */
    #addTokenToGameBoard(token) {  }


    #isLineCompleted() { }
    #isTimeUp() { }
    #isPlayersWithOutTokens() { }

}