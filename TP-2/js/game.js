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
    #events;

    /**
     * Constructor
     * @param {GameBoard} gameBoard The num of tile in x axis
     * @param {HTMLCanvasElement}  canvas The token background image 
     * @param {number}    timer The maximum time the game can last, expressed in seconds 
     */
    constructor(canvas, gameBoard, player1, player2, timer = 300) { 
        this.#gameBoard = gameBoard;
        this.#player1   = player1   
        this.#player2   = player2
        this.#canvas    = canvas;
        this.#height    = canvas.height;
        this.#width     = canvas.width;
        this.#timer     = timer;
        this.#ctx       = canvas.getContext('2d');
        this.#events = {};
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
        let playerIterator = 
            function*() {
                let aux = true;
                while (true) {
                    yield ((aux) ? this.#player1 : this.#player2)
                    aux = !aux;
                }
            }.apply(this);
        
        const players = {
            player: null, 
            nextPlayer: function(){ this.player =  playerIterator.next().value}
        } 
        
        players.nextPlayer()

        const mouse = {
            clicked: false,
            lastClicked: null,
            x: null, 
            y: null
        }

        // Mouse events
        this.#addEvent("mouseout",  this.#onMouseOut.bind(this, mouse));
        this.#addEvent("mousedown", this.#onMouseDown.bind(this, mouse, players));
        this.#addEvent("mouseup",   this.#onMouseUp.bind(this, mouse, players));
        this.#addEvent("mousemove", (e)=>{this.#onMouseMove(e, mouse)});
        
        // Game events:
        this.#addEvent("gameover", this.#removeEvents.bind(this));

        this.drawGame();

     }

    #onMouseOut(mouse) {
        mouse.clicked = false;
        mouse.lastClicked = null;
        mouse.x = null;
        mouse.y = null;
    }

    #onMouseMove(e, mouse) {
        mouse.x = e.clientX - this.#canvas.offsetLeft;
        mouse.y = e.clientY - this.#canvas.offsetTop ;
        if(mouse.clicked) {
            if(mouse.lastClicked!=null) {
                let token = mouse.lastClicked;
                token.setX(mouse.x); token.setY(mouse.y);
            }
        }
    }

    #onMouseDown(mouse, players) {
        let player = players.player;
        mouse.clicked = true;
        mouse.lastClicked = this.selectToken(player, mouse.x, mouse.y);
        mouse.lastClicked.setAnimation(mouse.lastClicked.getAnimations().selected);
    }

    #onMouseUp(mouse, players) {
        mouse.clicked = false;
        if(mouse.lastClicked) {
            if (this.#addTokenToGameBoard(mouse.lastClicked)) {
                players.nextPlayer();
            }
        }
        mouse.lastClicked.setAnimation(mouse.lastClicked.getAnimations().default);
        mouse.lastClicked = null;
        this.#endGame();
    }

    /** 
     *  Finish the game
     *  Inform who is the winner  
     */
    #endGame() {
        let isTheGameOver = false;
        if(this.#isLineCompleted()) {
            let tokensLine = this.#gameBoard.getLineFormed();
            tokensLine.forEach( token => {
                tokensLine.setAnimation(token.getAnimations().winner);
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


    #isLineCompleted() {
        return this.#gameBoard.isLineFormed();
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
        this.#canvas.addEventListener(eventName, callback.bind(this, ...args));
        Object.assign(this.#events, {"name": eventName,"callback": callback})
    }

    #removeEvents() {
        for (const event of this.#events) {
            this.#canvas.removeEventListener(event.name, event.callback)
        }
    }

}