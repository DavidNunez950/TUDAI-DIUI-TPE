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
    constructor(html) {
        super("obstacle", html);
        this.html.classList.add("obstacle");
    }
    //#endregion

    //#region methods
    /**
     * 
     * @param {Function} remove 
     * @param {Player} player 
     */
    collide(remove, player) {
        if(!player.immunity) {
            player.lifes -= 1;
            setTimeout(()=> {remove(this.html)}, 1000)
        }
    }

    //#endregion
}