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
    lineFormed;
    #tileUsed;
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
        this.#numTileX = numTileX;
        this.#numTileY = numTileY;
        this.#tileSize = tileSize;
        this.#numLine = numLine;
        this.#tokens = []// new Token()[][]; // Inicializar una matríz de numTileX * numTileY
        for (let i = 0; i < numTileX; i++) {
            let row = []
            for (let j = 0; j < numTileX; j++) {
                row.push(null)
            }
            this.#tokens.push(row);
        }
        this.tileUsed = 0;
        this.lineFormed = [];
        this.#tile = image;
        this.#size = size;
        this.#ctx = ctx;
    }

    /**
     * Add a token to the GameBoard
     * @param {Token} token The token to add
     * @return {boolean} A boolean indicating whether it could be added 
     */
    addToken(token) {
        let tokenX = token.getX() - this.#squareCoordinates.x1;
        let tokenY = token.getY() - this.#squareCoordinates.y1;
        let size = this.#squareCoordinates.x2 - this.#squareCoordinates.x1;
        if(tokenX > 0 && tokenX < size) {
            if(tokenY > 0 && tokenY < size) {
                let {col, row} = this.#calculateColumn(tokenX, tokenY);
                for (let i = this.#numTileY-1; i >= col; i--) {
                    if(this.#tokens[i][row] == null) {
                        this.#tokens[i][row] = token;
                        token.setX(this.#squareCoordinates.x1 + ((row * this.#tileSize) + (this.#tileSize/2)))
                        token.setY(this.#squareCoordinates.y1 + ((i * this.#tileSize) + (this.#tileSize/2)))
                        token.setUsed(true);
                        this.#tileUsed++;
                        return true;
                    }
                }
            }
        }
        return false;
    } 
    
    /**
     * Calculates with x and y of a token the position of the column in its matrix of tokens 
     * @param {number} x The x position of the token 
     * @param {number} y The y position of the token 
     */
    #calculateColumn(x, y) {
        let size = this.#squareCoordinates.x2 - this.#squareCoordinates.x1;
        // let col = Math.floor((x / this.#size) * this.#numTileX) - 1;
        // let row = Math.floor((y / this.#size) * this.#numTileX) - 1;
        let row = Math.floor((x / (this.#numTileX*this.#tileSize)) * this.#numTileX);
        let col = Math.floor((y / (this.#numTileY*this.#tileSize)) * this.#numTileY);
        return {col, row};
    } 
    
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
     isLineFormed(token) {
        let size = this.#squareCoordinates.x2 - this.#squareCoordinates.x1;
        let tokenX = token.getX() - this.#squareCoordinates.x1;
        let tokenY = token.getY() - this.#squareCoordinates.y1;
        if(tokenX > 0 && tokenX < size) {
            if(tokenY > 0 && tokenY < size) {
                let {col, row} = this.#calculateColumn(tokenX, tokenY);
                let playerColor = token.getPlayerColor();

                let generator = (index, value, limit, callback)=> { 
                    return (function*() {
                        while (callback(index, limit)) {
                            yield index;
                            index += value;
                        }
                    })()
                }

                let increment = (index, max) => generator(index,  1, max, (a, b) => (a <  b));
                let decrement = (index, min) => generator(index, -1, min, (a, b) => (a >= b));
                let nothing   = (index)      => generator(index,  0,   0,     () => ( true ));
                
                let it = (itX, itY)=> { 
                    return (function*() {
                        let x = itX.next(), y = itY.next();
                        while (!x.done && !y.done) {
                            yield {"x": x.value, "y": y.value};
                            x = itX.next(); y = itY.next();
                        }
                    })();
                }
                let geSameToken = (it, line, playerColor) => {
                    let val = it.next()
                    if(line.length < (this.#numLine - 1)) {
                        if(!val.done) {
                            let {x, y} = val.value;
                            const t = this.#tokens[y][x];
                            if(t != null && t.getPlayerColor() == playerColor) {
                                line.push(t);
                                geSameToken(it, line, playerColor)
                            } 
                        } 
                    }
                    return line;
                }

                let getLineToken = (itf, its) => {
                    let isLineFormed = false;   
                    this.lineFormed = [];   
                    geSameToken(itf, this.lineFormed, playerColor);
                    geSameToken(its, this.lineFormed, playerColor);
                    isLineFormed = this.lineFormed.length == (this.#numLine - 1);
                    if(!isLineFormed) { 
                        this.lineFormed = [];
                    } else {
                        this.lineFormed.push(token)
                    }
                    return isLineFormed; 
                };  
                  
                return(
                    getLineToken(
                        it(decrement(row-1, 0)             ,nothing(col, col)),
                        it(increment(row+1, this.#numTileX),nothing(col, col))
                        ) ||
                    
                    getLineToken(
                        it(  nothing(row, row),decrement(col-1, 0)),
                        it(  nothing(row, row),increment(col+1, this.#numTileY))
                        ) ||

                    getLineToken(
                        it(decrement(row-1, 0),             increment(col+1, this.#numTileY)),
                        it(increment(row+1, this.#numTileX),decrement(col-1, 0))
                        ) ||

                    getLineToken(
                        it(decrement(row-1, 0),             decrement(col-1, 0)),
                        it(increment(row+1, this.#numTileX),increment(col+1, this.#numTileY))
                        )
                    );
            }
        }
        return false;
    }

    clear() {
        for (let i = 0; i < this.#numTileY; i++) {
           for (let j = 0; j < this.#numTileX; j++) {
               this.#tokens[i][j] = null;
           } 
        }
    }

    getLineFormed() { return this.lineFormed}

    isFull() {
        return this.#tileUsed == this.#numTileX * this.#numTileX; 
    }
   
    /**
     * Draw the column and rows and fill them with the tile image 
     */
    drawGameBoard() {
        let aux = false;
        for (let i = 0; i < this.#numTileY; i++) {
            aux = !aux;
           for (let j = 0; j < this.#numTileX; j++) {
            aux = !aux;
            this.#ctx.beginPath()
            this.#ctx.fillStyle = (aux) ? "#FAC88A" : "#5E412F";
            // this.#ctx.fillStyle = (aux) ? "#ffffff" : "#000000";
            this.#ctx.fillRect(
                this.#squareCoordinates.x1 + this.#tileSize * j,
                this.#squareCoordinates.y1 + this.#tileSize * i ,
                this.#tileSize,
                this.#tileSize
            );
           } 
        }
    } 

    setContext(ctx) {this.#ctx = ctx}
}