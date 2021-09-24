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

    #squareCoordinates;
    #playerColor;
    #image;
    #size;
    #used;
    #ctx;
    #x;
    #y;

    /**
     * Constructor
     * @param {SquareCoordinate} squareCoordinates The area where the Game Board will be drawn 
     * @param {string} playerColor The playercolor
     * @param {ImageData}   image The token background image 
     * @param {number}       size The token size 
     * @param {CanvasRenderingContext2D} ctx The context where the game board should be drawn;
     */
    constructor(squareCoordinates, playerColor, image, size, ctx) {
        this.#squareCoordinates = squareCoordinates;
        this.#playerColor = playerColor;
        this.#image      = image;
        this.#size       = size;
        this.#used       = false;
        this.#ctx        = ctx;
        this.#x = Math.random() * (this.#squareCoordinates.x2 - this.#size*2) + (this.#squareCoordinates.x1 + this.#size)
        this.#y = Math.random() * (this.#squareCoordinates.y2 - this.#size*2) + (this.#squareCoordinates.y1 + this.#size)
    }

    /**
     * Draw the token
     */
    draw() {
        this.#ctx.beginPath()
        this.#ctx.arc(this.#x, this.#y, this.#size, 0, Math.PI*2, false)
        this.#ctx.fillStyle = this.#playerColor
        this.#ctx.fill()
        this.#ctx.lineWidth = "2px"
        this.#ctx.strokeStyle = "black"
        this.#ctx.stroke()
        this.#ctx.drawImage(this.#image, this.#x-this.#size, this.#y-this.#size, this.#size*2, this.#size*2)
        this.#ctx.closePath()
    }

    /**
     * indicates if the figure has already been used on the board 
     * @return {boolean} a boolean
     */
    isUsed() { return this.#used }

    
    /**
     * Set the boolean that indicates whether the shape has already been used on the board
     * @param {boolean} isUsed the boolean
     */
    setUsed(isUsed) { return this.#used = isUsed }

    /**
     * Set the y position of the token 
     * @param {number} y The y position of the token 
     */
    set setX(x) { this.#x = x }

    /**
     * Set the y position of the token 
     * @param {number} y The y position of the token 
     */
    set setY(y) { this.#y = y }

    /**
     * Get the x position of the token 
     * @return {number} The x position of the token 
     */
    get x() { return this.#x }

    /**
     * Get the y position of the token 
     * @return {number} The y position of the token 
     */
    get y() { return this.#y }

}