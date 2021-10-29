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
     * @private @property @type {number}   
     */
    #gameSpeed
    /**
    * @private @property @type {HTMLElement}   
    */
    #dom
    //#endregion

    //#region constructor
    constructor(gameContainer = document.querySelector(".game-container")) {    
        this.addHtml(gameContainer);
        this.#entities = [];
        this.#gameSpeed = 2;
   }

    gameStart(player = "maskdude") {
        this.#player.html.classList.add(player);
        this.#player.lifes = 5;
        this.#player.score = 0;
        Object.values(this.#dom.children).forEach(child => child.classList.remove("hide"));
        this.#entities = [];
        this.#gameSpeed = 2;
        this.gameLoop();
    }
    //#endregion

    //#region methods
    gameLoop() {
        this.#addEventListner()
        let lastTime = null;
        let frame = 0;
        let loop = (time) => {
            if (lastTime != null) {
                let timeStep = Math.min(time - lastTime, 100) / 1000;
                if (true === false) return;
            }
            lastTime = time;
            frame++;
            this.#player.update();
            if(Math.round(lastTime)%150 >=0 && Math.round(lastTime)%300 <=10) {
                this.#addEntity()
            }
            for (let i = 0; i < this.#entities.length; i++) {
                const entity = this.#entities[i];
                    if(entity.x > -20) {
                        entity.x -= this.#gameSpeed;
                    } else {
                        this.#entities.splice(i, 1);
                        i--;
                    }
                    if(this.#player.isCollide(entity)) {
                        this.#entities.splice(i, 1);
                        i--;
                        entity.collide(this.#dom.removeChild.bind(this.#dom), this.#player);
                        this.#player.collide(entity.type);
                    }
                    entity.update()
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
    
    removeHtml() {
        let gameContainer =  this.#dom.parentElement;
        gameContainer.removeChild(this.#dom);
        Object.values(gameContainer.children).forEach( child => {
        });
        this.addHtml(gameContainer);
    }
    addHtml(gameContainer) {
        this.#player =  new Player(20, 20, 78, 56, Util.elt("div", ["walk", "hide"])),
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
    #addEntity() {
        let entity;
        if(Math.random()>0.8) {
            if(Math.random()>0.5) {
                let fruitTypes = ["apple", "banana", "cherries", "kiwi", "melon", "orange", "pineapple", "strawberry"];
                let fruitType = fruitTypes[Math.floor(Math.random()*fruitTypes.length)]
                entity = new Colectionable(600, 20, 15, 15, Util.elt("div",["fruit",fruitType,"displacing-left"],[],this.#dom));
            } else {
                entity = new Obstacle     (600, 20, 15, 15, Util.elt("div", ["enemy","slime","displacing-left"],[],this.#dom));
            }
            this.#entities.push(entity);
        }
    }

    #addEventListner() {
        [{"name": "click", "callback": this.#player.jump.bind(this.#player)}]
        .forEach(e => this.#dom.addEventListener(e.name, e.callback) );
    };
    #removeEventListner() {
        [{"name": "click", "callback": ()=>{}}]
        .forEach(e => this.#dom.removeEventListener(e.name, e.callback) );
    };
    //#endregion
}