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
    constructor(canvas, gameBoard, player1, player2, timer = 600) { 
        this.#gameBoard = gameBoard;
        this.#player1   = player1   
        this.#player2   = player2
        this.#canvas    = canvas;
        this.#height    = canvas.height;
        this.#width     = canvas.width;
        this.#timer     = timer;
        this.#ctx       = canvas.getContext('2d');
    }

    /** 
     *  draw the Game Board and the Tokens
     */
     drawGame() {
        this.#gameBoard.drawGameBoard();
        for (let i = this.#player1.length - 1; i >= 0; i--) {
            this.#player1[i].draw();
            this.#player2[i].draw();
        }
     }

    /** 
     *  Start the game
     *  When a winner is found, or time is up, or there is a player without chips, it calls to endGame 
     */
    startGame() { }
    
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