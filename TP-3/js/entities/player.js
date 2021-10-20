import { Entity } from "./Entity.js";

export { Player };

class Player extends Entity{
    #lifes
    #score
    #jumping
    #falling

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
        this.#jumping = false;
        this.#falling = false;
        this.#lifes = 5;
        this.#score = 0;
    }
    //#endregion

    //#region methods
    /**
     * Indicates whether the player is colliding with the entity. 
     * @param {Entity} enity 
     * @returns {Boolean} A boolean that indicates whether the player is colliding with the entity. 
     */
    collide(enityType) {
        console.log(this.lifes, this.#score)
        if(this.isDie()) {
            this.html.classList.add("die");
        }
    }

    isDie() { return this.#lifes<=0; }

    isCollide(entity) {
        return (
            (this.x > entity.x && this.x < entity.w + entity.x || this.x + this.w > entity.x && this.x + this.w < entity.w + entity.x) &&
            (this.y > entity.y && this.y < entity.y + entity.h || this.y + this.w > entity.y && this.y + this.w < entity.y + entity.h) 
        );
    }

    update() {
        super.update()
        if(this.#jumping||this.#falling) {
            this.jump();
        }
    }

    jump() {
        console.log(true)
        if(!this.#jumping) {
            this.#jumping = true;
        } 
        if(this.#jumping&&!this.#falling&& this.y > 100) {
            this.#falling = true;
        }
        if(this.#falling) {
            this.#jumping = false;
        }
        if(this.#jumping||this.#falling) {
            this.y += (!this.#falling) ? 1.5 : -1.5;
        }
        if(this.y <= 20) {
            this.#falling = false;
            this.#jumping = false;
        }
    }

    get lifes() {return this.#lifes}
    get score() {return this.#score} 

    set lifes(lifes) {this.#lifes = lifes}
    set score(score) {this.#score = score}
    //#endregion
}