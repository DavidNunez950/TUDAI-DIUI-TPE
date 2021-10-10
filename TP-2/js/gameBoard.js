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

    //#region properties&&constructor
    #squareCoordinates;
    #lineFormed;
    #tileUsed;
    #numTileX;
    #numTileY;
    #tileSize;
    #numLine;
    #tokens;
    #tile;
    #ctx;

    /**
     * Constructor
     * @param {SquareCoordinate} squareCoordinates The area where the Game Board will be drawn 
     * @param {number} numTileX The num of tile in x axis
     * @param {number} numTileY The num of tile in y axis 
     * @param {number} tileSize The tile size
     * @param {number} numLine  The number of token in line to win 
     * @param {ImageData} iamge The tile background image 
     * @param {CanvasRenderingContext2D} ctx The context where the game board should be drawn;
     */
    constructor(squareCoordinates, numTileX, numTileY, tileSize, numLine, image, ctx) {
        this.#squareCoordinates = squareCoordinates;
        this.#numTileX = numTileX;
        this.#numTileY = numTileY;
        this.#tileSize = tileSize;
        this.#numLine = numLine;
        this.#tokens = [];
        for (let i = 0; i < numTileX; i++) {
            let row = []
            for (let j = 0; j < numTileX; j++) {
                row.push(null)
            }
            this.#tokens.push(row);
        }
        this.tileUsed = 0;
        this.#lineFormed = [];
        this.#tile = image;
        this.#ctx = ctx;
    }
    //#endregion
  
    //#region fucntion
    /**
     * Remove all the tokens in the board
     */
     clear() {
        for (let i = 0; i < this.#numTileY; i++) {
           for (let j = 0; j < this.#numTileX; j++) {
               this.#tokens[i][j] = null;
           } 
        }
    }
    //#endregion

    //#region functions to add a tile to the board and search for a line 
    /**
     * Calculates with x and y of a token the position of the column in its matrix of tokens 
     * @param {Token} token the 
     * @return {Json} {x, y} The token positions on the board in a JSON
     */
     #calculateColumn(token) {
        let x = token.getX() - this.#squareCoordinates.x1; // Coordinates relative to the  
        let y = token.getY() - this.#squareCoordinates.y1; // board are calculated
        let row = Math.floor((x / (this.#numTileX*this.#tileSize)) * this.#numTileX);
        let col = Math.floor((y / (this.#numTileY*this.#tileSize)) * this.#numTileY);
        return {col, row};
    } 

    /**
     * Add a token to the GameBoard
     * @param {Token} token The token to add
     * @return {boolean} A boolean indicating whether it could be added 
     */
    addToken(token) {
        if(token.getX() > this.#squareCoordinates.x1 && token.getX() < this.#squareCoordinates.x2) {
            if(token.getY() > this.#squareCoordinates.y1 && token.getY() < this.#squareCoordinates.y2) {
                let {col, row} = this.#calculateColumn(token);
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
     * The function search for a line of tokens formed horizontally, vertically, or in increasing or 
     * decreasing diagonal, fixing to the left and right of the token 
     * @param {Token} token The token to add
     * @return {boolean} boolean A boolean indicating whether it could be added 
     */
     isLineFormed(token) {
        if(token.getX() > this.#squareCoordinates.x1 && token.getX() < this.#squareCoordinates.x2) {
            if(token.getY() > this.#squareCoordinates.y1 && token.getY() < this.#squareCoordinates.y2) {
                let {col, row} = this.#calculateColumn(token);
                let playerColor = token.getPlayerColor();

                // 1. Se definen 3 funciones que retornan una instancia distinta de iteradores, 
                // utilizando generadores, que pueden incrementar o decrementar hasta un
                // límite dado, o retornar infinitamente un valor:
                let generator = (index, value, limit, callback) => { 
                    return (function*() {
                        while (callback(index, limit)) {
                            yield index;
                            index += value;
                        }
                    })();
                }

                let increment = (index, max) => generator(index,  1, max, (a, b) => (a <  b));
                let decrement = (index, min) => generator(index, -1, min, (a, b) => (a >= b));
                let nothing   = (index)      => generator(index,  0,   0,     () => ( true ));
                
                // 2. Se define una función que retorna una instancia de un
                // iterador doble(que contiene dos iteradores), uno para el eje x,
                // y otro para el eje y, hasta que cualquiera de los dos se queda sin elementos
                // que iterar
                let it = (itX, itY)=> { 
                    return (function*() {
                        let x = itX.next(), y = itY.next();
                        while (!x.done && !y.done) {
                            yield {"x": x.value, "y": y.value};
                            x = itX.next(); y = itY.next();
                        }
                    })();
                }

                // 3. Se define una función que se llama recursivamente encontrado las fichas del 
                // mismo jugador hasta encontrar la misma cantidad de fichas en línea requerida
                // por el juego, disminuida en uno
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

                // 4. Utilizando dos iteradores dobles distintos para buscar las fichas
                let getLineToken = (itf, its) => {
                    let isLineFormed = false;   
                    this.#lineFormed = [];   
                    geSameToken(itf, this.#lineFormed, playerColor);
                    geSameToken(its, this.#lineFormed, playerColor);
                    // Si la línea formada es iguala a la cantidad de fichas en línea requerida
                    // por el juego disminuido en uno entonteces se agrega la última ficha,
                    // si no, se vacía el arreglo
                    isLineFormed = this.#lineFormed.length == (this.#numLine - 1);
                    if(!isLineFormed) { 
                        this.#lineFormed = [];
                    } else {
                        this.#lineFormed.push(token)
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
    //#endregion
    
    //#region draw function
    /**
     * Draw the board background and them fill the rows with the tile image 
     */
    drawGameBoard() {
        this.#ctx.beginPath();
        this.#ctx.moveTo(this.#squareCoordinates.x1+20,this.#squareCoordinates.y1-10);
        this.#ctx.arcTo(this.#squareCoordinates.x1-10,this.#squareCoordinates.y1-10, this.#squareCoordinates.x1-10,this.#squareCoordinates.y1, 30);
        this.#ctx.arcTo(this.#squareCoordinates.x1-10,this.#squareCoordinates.y2+10,this.#squareCoordinates.x1,this.#squareCoordinates.y2+10, 30);
        this.#ctx.arcTo(this.#squareCoordinates.x2+10,this.#squareCoordinates.y2+10, this.#squareCoordinates.x2+10,this.#squareCoordinates.y2, 30);
        this.#ctx.arcTo(this.#squareCoordinates.x2+10,this.#squareCoordinates.y1-10,this.#squareCoordinates.x2,this.#squareCoordinates.y1-10, 30);
        this.#ctx.fillStyle = "#5bb0ff";
        this.#ctx.fill();
        for (let i = 0; i < this.#numTileY; i++) {
            for (let j = 0; j < this.#numTileX; j++) {
                if(!this.#tokens[i][j]) {
                    let x = this.#squareCoordinates.x1 + this.#tileSize * j; 
                    let y = this.#squareCoordinates.y1 + this.#tileSize * i;
                    this.#ctx.drawImage(this.#tile, x, y, this.#tileSize, this.#tileSize)
                }
            } 
        }        
    } 
    //#endregion

    //#region getter&&setter
    /** 
     * Returns true if the board does not have free tiles 
     */
    isFull() { return this.#tileUsed == this.#numTileX * this.#numTileX;  }

    /** 
     * Returns the lined formed
     */
    getLineFormed() { return this.#lineFormed }

    /** 
     * Set the board context
     */
    setContext(ctx) {this.#ctx = ctx}
    //#endregion
}