export { GameBoard }
import { Token } from './token.js'

/**
 * @typedef SquareCoordinate
 * @prop {number} x1 the lowest  x position of the square
 * @prop {number} x2 the highest x position of the square  
 * @prop {number} y1 the lowest  y position of the square
 * @prop {number} y2 the highest y position of the square
 */

/** The Game Board class */
class GameBoard {

    #squareCoordinates;
    #numTileX;
    #numTileY;
    #tileSize;
    #numLine;
    #tokens;
    #image;
    #tile;
    #size;
    #ctx;

    /**
     * Constructor
     * @param {SquareCoordinate} squareCoordinates The area where the Game Board will be drawn 
     * @param {number} numTileX The num of tile in x axis
     * @param {number} numTileY The num of tile in y axis 
     * @param {number} tileSize The tile size
     * @param {number} numLine  The number of token in line to win 
     * @param {ImageData} iamge The tile background image 
     * @param {number}     size The board game size 
     * @param {CanvasRenderingContext2D} ctx The context where the game board should be drawn;
     */
    constructor(squareCoordinates, numTileX, numTileY, tileSize, numLine, image, size, ctx) {
        this.#squareCoordinates = squareCoordinates;
        this.#playerName = playerName;
        this.#numTileX = numTileX;
        this.#numTileY = numTileY;
        this.#tileSize = tileSize;
        this.#numLine = numLine;
        this.#tokens = new Token[[,],[,]]; // Inicializar una matríz de numTileX * numTileY
        this.#tile = image;
        this.#size = size;
        this.#ctx = ctx;
    }

    /**
     * Add a token to the GameBoard
     * @param {Token} token The token to add
     * @return {boolean} A boolean indicating whether it could be added 
     */
    addToken(token) {  } 
    
    /**
     * Calculates with x and y of a token the position of the column in its matrix of tokens 
     * @param {number} x The x position of the token 
     * @param {number} y The y position of the token 
     */
    #calculateColumn(x, y) {  } 
    
    /**
     * Returns the last free position of a row, it can return a -1 to indicate that it is complete 
     * @param {number} i The position of the column from which you want to get the last free row  
     */
    #isRowFull(i) {  }
   
    /**
     * Looks for a horizontal, vertical, diagonally increasing and decreasing line. Runs once per shift 
     * @param {Token} token The token to add
     * @return {boolean} boolean A boolean indicating whether it could be added 
     */
    #isFormedLine(token) {  }
   
    /**
     * Draw the column and rows and fill them with the tile image 
     */
    #drowGameBoard() {  } 

}