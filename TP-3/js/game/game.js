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
    constructor() {
        let playerHtml = Util.elt("div",[{"name": "class", "value": "player"}])
        this.#dom = Util.elt(
            "div",
            [{"name": "class", "value": "game"}], 
            Util.elt("div", [{"name": "class", "value": "game-container"}], document.querySelector("body")),
            [playerHtml]);
        this.#player =  new Player(
            20, 20, 30, 10, playerHtml
        );
        this.#gameSpeed = 2;
        this.#entities = [];
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
            if(Math.random()>0.9) {this.#addEntity()}
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
                        this.#player.collide(typeof entity);
                    }
                    entity.update()
                } 
                if(!this.#player.isDie()) { requestAnimationFrame(loop); }
        }
        requestAnimationFrame(loop);
    };

    #addEntity() {
        let entity;
        if(Math.random()>0.9) {
            if(Math.random()>0.5) {
                entity = 
                new Colectionable(600, 20, 15, 15, 
                    Util.elt(
                        "div",
                        [{"name": "class", "value": "colectionable"}],
                        this.#dom
                    )
                )
            } else {
                entity = 
                new Obstacle(600, 20, 15, 15, 
                    Util.elt(
                        "div",
                        [{"name": "class", "value": "obstacle"}],
                        this.#dom
                    )
                )
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