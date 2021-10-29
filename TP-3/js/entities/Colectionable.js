import { Entity } from "./Entity.js";

export { Colectionable };

class Colectionable extends Entity{
    //#region constructor
    /**
     * initialize a new instance of a Colectionable
     * @param {number} x 
     * @param {number} y 
     * @param {number} h 
     * @param {number} w 
     * @param {HTMLElement} html 
     */
    constructor(html) {
        super("colectionable", html);
        this.html.classList.add("colectionable");
    }
    //#endregion

    //#region methods
    /**
     * Collides with an entity 
     * @param {Function} remove 
     * @param {Player} player 
     */
    collide(remove, player) {
        player.score += 1;
        this.html.classList.add("coin-dissapear");
        ["apple", "banana", "cherries", "kiwi", "melon", "orange", "pineapple", "strawberry"]
        .forEach(eltClass => {
            this.html.classList.remove(eltClass);
        });
        this.html.classList.add("collected");
        setTimeout(()=> {
            remove(this.html);
        }, 1000);
    }
    //#endregion
}