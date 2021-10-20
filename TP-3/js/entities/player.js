import { Entity } from "./Entity.js";

export { Player };

class Player extends Entity{
    //#region constructor
    /**
     * initialize a new instance of a Player
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
     * Indicates whether the player is colliding with the entity. 
     * @param {Entity} enity 
     * @returns {Boolean} A boolean that indicates whether the player is colliding with the entity. 
     */
    isCollide(entity) {
        return (
            (this.x < enity.w + entity.x || this.x + this.w > entity.x) &&
            (this.y < enity.y + entity.h || this.y + this.h > entity.y) 
        );
    }
    //#endregion
}