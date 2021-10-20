import { Entity } from "./Entity.js";
import { Player } from "./player.js";

export { Obstacle };

class Obstacle extends Entity{
    //#region constructor
    /**
     * initialize a new instance of a Obstacle
     * @param {number} x 
     * @param {number} y 
     * @param {number} h 
     * @param {number} w 
     * @param {HTMLElement} html 
     */
    constructor(x, y, h, w, html) {
        super(x, y, h, w, html);
    }
    //#endregion

    //#region methods
    /**
     * 
     * @param {Function} remove 
     * @param {Player} player 
     */
    collide(remove, player) {
        player.lifes -= 1;
        setTimeout(()=> {remove(this.html)}, 1000)
    }
    //#endregion
}