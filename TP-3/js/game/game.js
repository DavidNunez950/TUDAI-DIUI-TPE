import { Entity } from "../entities/Entity.js";
import { Player } from "../entities/player.js";

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
    //#endregion

    //#region constructor
    constructor() {}
    //#endregion

    //#region methods
    gameLoop();
    addEventListner();
    removeEventListner();
    //#endregion
}