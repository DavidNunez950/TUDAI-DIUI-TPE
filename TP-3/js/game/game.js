import { Entity } from "../entities/Entity.js";
import { Player } from "../entities/player.js";
import { Colectionable } from "../entities/Colectionable.js";
import { Obstacle } from "../entities/Obstacle.js";
import { Util }   from "../util/util.js";

export { Game };
class Game {
    //#region propperties
    /**
     * @private @property @type {Player}   
     */
    #player
    /**
     * @private @property @type {Entity[]}   
     */
    #entities
    /**
    * @private @property @type {HTMLElement}   
    */
    #dom
    //#endregion

    //#region constructor
    constructor(gameContainer = document.querySelector(".game-container")) {    
        this.#createHtml(gameContainer);
        this.#entities = [];
   }

    gameStart(player = "maskdude") {
        this.#player.html.classList.add(player);
        this.#player.lifes = 5;
        this.#player.score = 0;
        Object.values(this.#dom.children).forEach(child => child.classList.remove("hide"));
        this.#entities = [];
        this.gameLoop();
    }
    //#endregion

    //#region methods
    gameLoop() {
        this.#dom.addEventListener("click", this.#player.jump.bind(this.#player))
        let startTime = null;
        let lastTime = null;
        let elapsed  = null;
        let loop = (time) => {
            if (startTime === null) {
                // let elapsed = Math.min(time - startTime, 100) / 1000;
                startTime = time;
            }
            elapsed = Math.round(time - startTime, 100 / 1000);
            if(Math.random()>0.5) {
                if(elapsed%1000 <=20) {
                    this.#addEntity("obstacle")
                }
                if(elapsed%100 <=15) {
                    this.#addEntity("colectianable")
                }
            }
            for (let i = 0; i < this.#entities.length; i++) {
                const entity = this.#entities[i];
                    let playerColliding = this.#player.isCollide(entity);
                    if(entity.x + entity.w < 0 || playerColliding) {
                        this.#entities.splice(i, 1);
                        i--;
                        if(playerColliding) {
                            entity.collide(this.#dom.removeChild.bind(this.#dom), this.#player);
                            this.#player.collide(entity.type);
                        } else {
                            this.#dom.removeChild(entity.html)
                        }
                    }
                } 
                if(!this.#player.isDie()) { 
                    requestAnimationFrame(loop); 
                } else {
                    let screenContainer = document.querySelector("#screen-container");
                    let restartBtn = document.querySelector("#btn-restart");
                    restartBtn.classList.toggle("d-none");
                    restartBtn.parentElement.classList.toggle("d-none");
                    screenContainer.classList.toggle("d-none")
                    screenContainer.classList.toggle("hide-up")
                }
        }
        requestAnimationFrame(loop);
    };
    
    restartGame() {
        let gameContainer =  this.#dom.parentElement;
        gameContainer.removeChild(this.#dom);
        this.#createHtml(gameContainer);
    }
    #createHtml(gameContainer) {
        this.#player =  new Player(Util.elt("div", ["walk", "hide"])),
        this.#dom = 
        Util.elt("div", ["game"], 
        [   
            Util.elt("div", ["layer", "layer-1"]),
            Util.elt("div", ["layer", "layer-2"]),
            Util.elt("div", ["layer", "layer-3"]),
            Util.elt("div", ["layer", "layer-4", "hide"]),
            Util.elt("div", ["layer", "layer-5", "hide"]),
            this.#player.html,
            Util.elt("div", ["player-counter", "life", "hide"], ["div", "div"]),
            Util.elt("div", ["player-counter", "coin", "hide"], ["div", "div"]),
            Util.elt("div", ["layer", "layer-6", "hide"])
        ], gameContainer); 
    }
    #addEntity(type) {
        let entity;
            switch (type) {
                case "colectianable":
                    let fruitTypes = ["apple", "banana", "cherries", "kiwi", "melon", "orange", "pineapple", "strawberry"];
                    let fruitType = fruitTypes[Math.floor(Math.random()*fruitTypes.length)]
                    entity = new Colectionable(Util.elt("div",["fruit",fruitType,"displacing-left"],[],this.#dom));
                    break;
                case "obstacle":
                    entity = new Obstacle     (Util.elt("div", ["enemy","slime","displacing-left"],[],this.#dom));
                default:
                    break;
            }
            this.#entities.push(entity);
    }
    //#endregion
}