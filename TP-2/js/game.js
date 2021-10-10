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

    //#region properties&&constructor
    #playerWithTurn;
    #gameInitTime
    #gameMaxTime;
    #canvasCopy;
    #gameBoard;
    #player1;
    #player2;
    #canvas;
    #height;
    #width;
    #mouse;
    #ctx;

    /**
     * Constructor
     * @param {HTMLCanvasElement}  canvas The canvas HTML
     * @param {GameBoard} gameBoard The num of tile in x axis
     * @param {Token[]} player1 The player one's tokens
     * @param {Token[]} player2 The player two's tokens
     * @param {number}    timer The maximum time the game can last, expressed in minutes 
     */
    constructor(canvas, gameBoard, player1, player2, timer = 300) { 
        this.#gameMaxTime    = timer / 1000; 
        this.#gameInitTime   = null;
        this.#playerWithTurn = null;
        this.#canvasCopy = canvas.cloneNode();
        this.#gameBoard = gameBoard;
        this.#player1   = player1   
        this.#player2   = player2
        this.#canvas    = canvas;
        this.#height    = canvas.height;
        this.#width     = canvas.width;
        this.#ctx       = canvas.getContext('2d');
        this.#mouse = {
            clicked: false,
            lastClicked: null,
            x: null, 
            y: null
        };
    }
    //#endregion

    //#region draw function
    /** 
     *  Draw the Game Board and the Tokens
     */
     drawGame() {
        this.#ctx.clearRect(0, 0, this.#width, this.#height)
        this.#gameBoard.drawGameBoard();
        for (let i = 0; i < this.#player1.length; i++) {
            this.#player1[i].draw();
            this.#player2[i].draw();
        }
        requestAnimationFrame(this.drawGame.bind(this));
     }
     //#endregion

    //#region Function to manage the flow of the game
    /** 
     *  Start the game
     *  When a winner is found, or time is up, or there is a player without chips, it calls to endGame 
     */
    startGame() {
        this.#changeTurn();
        this.#gameInitTime = Date.now();
        // Mouse events 
        this.#addEvent("mouseout",  this.#onMouseOut );
        this.#addEvent("mousedown", this.#onMouseDown);
        this.#addEvent("mouseup",   this.#onMouseUp  );
        this.#addEvent("mousemove", this.#onMouseMove);
        
        // Game events:
        this.#addEvent("gameover", this.removeEvents.bind(this));

        this.drawGame();

     }

    /** 
     * Pass the turn to the next player 
     */
     #changeTurn() {
        if(this.#playerWithTurn == null) {
            this.#playerWithTurn = this.#player2;    
        }
        console.log(this.#playerWithTurn, this.#player2)
        this.#playerWithTurn = ((this.#playerWithTurn[0].getPlayerColor() != this.#player1[0].getPlayerColor()) ? this.#player1 : this.#player2);
        this.#emmitEvent(
            new CustomEvent(
                    "game-changeturn", {
                    detail: {
                        playerColor: this.#playerWithTurn[0].getPlayerColor(),
                        playerImage: this.#playerWithTurn[0].getImage(),   
                    }
                })
            );
    }

    /** 
     * Finish the game:
     * Using the last token added to the board, it informs if there is a winner, 
     * or if it is a tie, in case the tile has occupied the last free tile on the board. 
     * @param {Token} token The last token added to gameboard   
     */
    #endGame(token) {
        let isTheGameOver = false;
        if(this.#isLineCompleted(token)) {
            let tokensLine = this.#gameBoard.getLineFormed();
            tokensLine.forEach( token => {
                token.setAnimation(token.getAnimations().winner);
            });
            this.#emmitEvent(
                new CustomEvent("gameover", {
                    detail: { 
                    message: "El juego ha terminado: hay un gandor",
                    playerColor: tokensLine[0].getPlayerColor(),
                    playerImage: tokensLine[0].getImage(),  
                }})
            );
            isTheGameOver = true;
        } else if (this.#isPlayersWithOutTokens()) {
            this.#emmitEvent(
                new CustomEvent("gameover", {detail: { message: "El juego termino en empate :/" }})
            );  
            isTheGameOver = true;
        } else if(this.#isTimeUp()){
            this.#emmitEvent(
                new CustomEvent("gameover", {detail: { message: "Se acabo el tiempo!" }})
            );
            isTheGameOver = true;
        }
    }
    
    /** 
     * Restart the game
     */
    restartGame() {
        for (let i = 0; i < this.#player1.length; i++) {
            this.#player1[i].setUsed(false);
            this.#player2[i].setUsed(false);
            this.#player1[i].setAnimation("default");
            this.#player2[i].setAnimation("default");
            this.#player1[i].backToOrigin();
            this.#player2[i].backToOrigin();
        }
        this.#gameBoard.clear();
        this.#gameInitTime = Date.now();
        this.#playerWithTurn = null;
        this.#mouse = {
            clicked: false,
            lastClicked: null,
            x: null, 
            y: null
        };
        this.startGame();
    }
    
    /**
     * Select a token with the x and y mouese coordiantes relatives to canvas
     * @param {Token[]} tokens The player's tokens  
     * @param {number} x The x position of the mouse 
     * @param {number} y The y position of the mouse 
     * @return {Token} a token if it finds it, or null if it doesn't  
     */
    selectToken(tokens, x, y) {
        let returned = null;
        tokens.forEach( token => {
            if(!token.isUsed()&&token.isInPoint(x, y)) {
                returned = token;
            }
        });
        return returned;
    }

    /** 
     * Add a token to the board if possible 
     * @param {Token} token The token to add to the game board 
     */
    #addTokenToGameBoard(token) {
        if (this.#gameBoard.addToken(token)) {
            return true;
        } else {
            token.backToOrigin();
            return false;
        }
    }


    #isLineCompleted(token) {
        if(token != null) {
            return this.#gameBoard.isLineFormed(token);
        }
        return false;
    }

    #isTimeUp() {
        return this.#gameInitTime - this.#gameMaxTime < 0;
    }

    #isPlayersWithOutTokens() {
        return this.#gameBoard.isFull();
    }
    //#endregion

    //#region Mouse Events: The events added to the canvas
    /**
     * Callback from mouse out event
     **/
    #onMouseOut() {
        this.#mouse.clicked = false;
        this.#mouse.lastClicked = null;
        this.#mouse.x = null;
        this.#mouse.y = null;
    }

    /**
     * Callback from mouse move event
     * @param {MouseEvent} e The EventMouse passes from the eventlistenner
     **/
    #onMouseMove(e) {
        this.#mouse.x = e.layerX;
        this.#mouse.y = e.layerY;
        if(this.#mouse.clicked) {
            if(this.#mouse.lastClicked!=null) {
                let token = this.#mouse.lastClicked;
                token.setX(this.#mouse.x); token.setY(this.#mouse.y);
            }
        }
    }

    /**
     * Callback from mouse down event
     **/
    #onMouseDown() {
        this.#mouse.clicked = true;
        this.#mouse.lastClicked = this.selectToken(this.#playerWithTurn, this.#mouse.x, this.#mouse.y);
        if(this.#mouse.lastClicked != null) {
            this.#mouse.lastClicked.setAnimation(this.#mouse.lastClicked.getAnimations().selected);
        }
    }


    /**
     * Callback from mouse up event
     **/
    #onMouseUp() {
        this.#mouse.clicked = false;
        if(this.#mouse.lastClicked != null) {
            if (this.#addTokenToGameBoard(this.#mouse.lastClicked)) {
                this.#changeTurn();
            }
            this.#mouse.lastClicked.setAnimation(this.#mouse.lastClicked.getAnimations().default);
            this.#endGame(this.#mouse.lastClicked);
        }
        this.#mouse.lastClicked = null;
    }
    //#endregion

    //#region Handle Events:
    #emmitEvent(event) {
        this.#canvas.dispatchEvent(event);
    }

    #addEvent(eventName, callback) {
        this.#canvas.addEventListener(eventName, callback.bind(this));
    }

    removeEvents() {
        let parentElement = this.#canvas.parentElement;
        parentElement.innerHTML = "";
        this.#canvas = this.#canvasCopy.cloneNode()
        this.#ctx = this.#canvas.getContext("2d");
        parentElement.appendChild(this.#canvas);
        for (let i = 0; i < this.#player1.length; i++) {
            this.#player1[i].setContext(this.#ctx);
            this.#player1[i].draw();
            this.#player2[i].setContext(this.#ctx);
            this.#player2[i].draw();
        }

        this.#gameBoard.setContext(this.#ctx)
        this.#gameBoard.drawGameBoard();
    }
    //#endregion 

}