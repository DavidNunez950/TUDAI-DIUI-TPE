import { Entity } from "./Entity.js";

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
    //#endregion
}