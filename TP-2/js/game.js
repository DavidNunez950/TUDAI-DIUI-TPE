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
    #playerWithTurn;
    #gameBoard;
    #player1;
    #player2;
    #canvas;
    #events;
    #height;
    #width;
    #timer;
    #mouse;
    #ctx;

    /**
     * Constructor
     * @param {GameBoard} gameBoard The num of tile in x axis
     * @param {HTMLCanvasElement}  canvas The token background image 
     * @param {number}    timer The maximum time the game can last, expressed in seconds 
     */
    constructor(canvas, gameBoard, player1, player2, timer = 300) { 
        this.#playerWithTurn = player1;
        this.#gameBoard = gameBoard;
        this.#player1   = player1   
        this.#player2   = player2
        this.#canvas    = canvas;
        this.#height    = canvas.height;
        this.#width     = canvas.width;
        this.#timer     = timer;
        this.#ctx       = canvas.getContext('2d');
        this.#events = {};
        this.#mouse = {
            clicked: false,
            lastClicked: null,
            x: null, 
            y: null
        };
    }

    /** 
     *  draw the Game Board and the Tokens
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

    /** 
     *  Start the game
     *  When a winner is found, or time is up, or there is a player without chips, it calls to endGame 
     */
    startGame() {


        // Mouse events 
        this.#addEvent("mouseout",  this.#onMouseOut.bind(this));
        this.#addEvent("mousedown", this.#onMouseDown.bind(this));
        this.#addEvent("mouseup",   this.#onMouseUp.bind(this));
        this.#addEvent("mousemove", this.#onMouseMove.bind(this));
        
        // this.#canvas.addEventListener("mousemove", this.#onMouseMove.bind(this));
        // Game events:
        this.#addEvent("gameover", this.#removeEvents.bind(this));

        this.drawGame();

     }

    #onMouseOut() {
        this.#mouse.clicked = false;
        this.#mouse.lastClicked = null;
        this.#mouse.x = null;
        this.#mouse.y = null;
    }

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

    #onMouseDown(players) {
        this.#mouse.clicked = true;
        this.#mouse.lastClicked = this.selectToken(this.#playerWithTurn, this.#mouse.x, this.#mouse.y);
        if(this.#mouse.lastClicked != null) {
            this.#mouse.lastClicked.setAnimation(this.#mouse.lastClicked.getAnimations().selected);
        }
    }

    #onMouseUp(players) {
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

    #changeTurn() {
        this.#playerWithTurn = 
        this.#playerWithTurn[0].getPlayerColor() != this.#player1[0].getPlayerColor() ?
        this.#player1 : this.#player2;
    }

    /** 
     *  Finish the game
     *  Inform who is the winner  
     */
    #endGame(token) {
        let isTheGameOver = false;
        if(this.#isLineCompleted(token)) {
            let tokensLine = this.#gameBoard.getLineFormed();
            tokensLine.forEach( token => {
                token.setAnimation(token.getAnimations().winner);
            });
            this.#emmitEvent(
                new Event("gameover-winnerfound", {detail: { message: "The winner lol!!!" }})
            );
            isTheGameOver = true;
        } else if (this.#isPlayersWithOutTokens()) {
            this.#emmitEvent(
                new Event("gameover-tie", {detail: { message: "The game end in a tie" }})
            );  
            isTheGameOver = true;
        } else if(this.#isTimeUp()){
            this.#emmitEvent(
                new Event("gameover-endtime", {detail: { message: "The time is over" }})
            );
            isTheGameOver = true;
        }

        if(isTheGameOver) {
            this.#emmitEvent(
                new Event("gameover", {detail: { message: "The time is over" }})
            );
        }
    }
    
    /** 
     *  Restart the game
     */
    restartGame() {  }
    
    /**
     * Select a token with the x and y mouese coordiantes
     * @param {Token[]} tokens The player's tokens  
     * @param {number} x The x position of the token 
     * @param {number} y The y position of the token 
     * @return {token} a token if it finds it, or null if it doesn't  
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
     * Añade una ficha al tablero si es posible
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
        // Date.now().timeactual() -timeiniciojeugo > timpoMaxJuego
        setTimeout(() => {
            this.#canvas.dispatchEvent(
                new Event(
                        "Time Over", {
                        detail: { message: "The time is over" }
                    })
                );
        }, (this.#timer * 1000));
    }

    #isPlayersWithOutTokens() {
        return this.#gameBoard.isFull();
    }

    // Handle Events:
    #emmitEvent(event) {
        this.#canvas.dispatchEvent(event);
    }

    #addEvent(eventName, callback, ...args) {
        // this.#canvas.addEventListener(eventName, callback, true).bind(this, ...args), true);
        this.#canvas.addEventListener(eventName, callback);
        this.#events[eventName] = callback;
    }

    #removeEvents() {
        this.#canvas = this.canvasCopy;
        // Object.keys(this.#events).forEach(name => {
        //     this.#canvas.removeEventListener(name, this.#events[name], true)
        //     console.log(name, this.#events[name])
        // })
    }

}