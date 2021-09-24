export { Token } 

/**
 * @typedef SquareCoordinate
 * @prop {number} x1 the lowest  x position of the square
 * @prop {number} x2 the highest x position of the square  
 * @prop {number} y1 the lowest  y position of the square
 * @prop {number} y2 the highest y position of the square
 */

/** The Token class*/
class Token {

    #squareCoordinates = {x1:0, x2:0, y1:0, y2:0};
    #playerName;
    #image;
    #size;
    #used;
    #ctx;
    #x;
    #y;

    /**
     * Constructor
     * @param {SquareCoordinate} squareCoordinates The area where the Game Board will be drawn 
     * @param {string} playerName The num of tile in x axis
     * @param {ImageData}   image The token background image 
     * @param {number}       size The token size 
     * @param {CanvasRenderingContext2D} ctx The context where the game board should be drawn;
     */
    constructor(squareCoordinates, playerName, image, size, ctx) {
        this.#squareCoordinates = squareCoordinates;
        this.#playerName = playerName;
        this.#image      = image;
        this.#size       = size;
        this.#used       = false;
        this.#ctx        = ctx;
        this.#x = 0; // un valor, puede ser aleatorio, dentro de squareCoordinates 
        this.#y = 0; // un valor, puede ser aleatorio, dentro de squareCoordinates 
    }

    /**
     * Draw the token
     */
    draw() { }

    /**
     * indicates if the figure has already been used on the board 
     * @return {boolean} a boolean
     */
    isUsed() {  }

    /**
     * Set the y position of the token 
     * @param {number} y The y position of the token 
     */
    set setX(x) {  }

    /**
     * Set the y position of the token 
     * @param {number} y The y position of the token 
     */
    set setY(y) {  }

    /**
     * Get the x position of the token 
     * @return {number} The x position of the token 
     */
    get x() {  }

    /**
     * Get the y position of the token 
     * @return {number} The y position of the token 
     */
    get y() {  }

}