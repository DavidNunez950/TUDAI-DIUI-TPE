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

    //#region properties&&constructor
    #squareCoordinates;
    #playerColor;
    #animation;
    #image;
    #size;
    #used;
    #ctx;
    #xBaseCoordinate;
    #yBaseCoordinate;
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
        this.#animation = "default";
        this.#used       = false;
        this.#ctx        = ctx;
        this.#xBaseCoordinate = Math.random() * ((this.#squareCoordinates.x2 - this.#squareCoordinates.x1) - this.#size * 2) + (this.#squareCoordinates.x1 + this.#size)
        this.#yBaseCoordinate = Math.random() * ((this.#squareCoordinates.y2 - this.#squareCoordinates.y1) - this.#size * 2) + (this.#squareCoordinates.y1 + this.#size)
        this.#x = this.#xBaseCoordinate;
        this.#y = this.#yBaseCoordinate;
    }
    //#endregion

    //#region functions
    /**
     * indicates if the xoordinates are inside the figure  
     * @param {number} x The x position of the mouse 
     * @param {number} y The y position of the mouse 
     * @return {boolean} a boolean
     */
    isInPoint(x, y) { 
        let dx = this.#x - x;
        let dy = this.#y - y;
        return (Math.sqrt((dx * dx + dy * dy)) < this.#size);
    }

    /**
     *  Return the token to its original position
     */
    backToOrigin() {
        this.#x = this.#xBaseCoordinate;
        this.#y = this.#yBaseCoordinate;
    }
    //#endregion

    //#region draw function
    /**
     * Draw the token
     */
     draw() {
        this.#ctx.beginPath()
        this.#ctx.arc(this.#x, this.#y, this.#size, 0, Math.PI*2, false)
        this.#ctx.fillStyle = this.#playerColor
        let {color, lineWidth} = this.#getBorderEffect();
        this.#ctx.lineWidth = lineWidth;
        this.#ctx.strokeStyle = color;
        this.#ctx.fill()
        this.#ctx.stroke()
        this.#ctx.drawImage(this.#image, this.#x-this.#size, this.#y-this.#size, this.#size*2, this.#size*2)
        this.#ctx.closePath()
    }

    #getBorderEffect() {
        if(this.#animation == "default") {
            return { color: "black", lineWidth: (this.#size/10) }
        } else {
            let lineWidth =(this.#size/3)
            let grd = this.#ctx.createRadialGradient(this.#x, this.#y, this.#size, this.#x, this.#y, this.#size+ lineWidth);
            if(this.#animation == "selected") {
                grd.addColorStop(0.0, "black");
                grd.addColorStop(0.01, "#e0e0e0");
                grd.addColorStop(1, "rgba(0, 0, 0, 0)");
            } else if(this.#animation == "winner"){
                grd.addColorStop(0.0, "black");
                grd.addColorStop(0.01, "#ffffbc");
                grd.addColorStop(1, "rgba(0, 0, 0, 0)");
            }
            return { color: grd, lineWidth: lineWidth };
        }
    }
    //#endregion

    //#region getter&&setter
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
    setX(x) { this.#x = x }

    /**
     * Set the y position of the token 
     * @param {number} y The y position of the token 
     */
    setY(y) { this.#y = y }

    /**
     * Get the x position of the token 
     * @return {number} The x position of the token 
     */
    getX() { return this.#x }

    /**
     * Get the y position of the token 
     * @return {number} The y position of the token 
     */
    getY() { return this.#y }
    
    /**
     * Get the player color
     */
    getPlayerColor() { return this.#playerColor }

    /**
     * Get the type animation
     */
    getAnimations() { return {default:"default", selected:"selected", winner:"winner"} }
    
    /**
     * Get the token image
     */
    getImage() { return this.#image; }

    /**
     * Set the type animation
     */
    setAnimation(animation = "default") { this.#animation =  animation; }

    /**
     * Set the token context
     */
    setContext(ctx) { this.#ctx = ctx }
    //#endregion
}