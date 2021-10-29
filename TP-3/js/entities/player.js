import { Entity } from "./Entity.js";

export { Player };

class Player extends Entity{
    #lifes
    #score
    #jumping
    #doublejumping
    #immunity 
    //#region constructor
    /**
     * initialize a new instance of a Player
     * @param {HTMLElement} html 
     */
    constructor(html) {
        super("player", html);
        this.#doublejumping = false;
        this.#jumping = false;
        this.#immunity = false;
        this.html.classList.add("player");
        this.a = 0;
    }
    //#endregion

    isDie() { return this.#lifes<=0; }

    isCollide(entity) { 
        return (
            (this.x < entity.x && this.x + this.w > entity.x || this.x < entity.w + entity.x && this.x + this.w > entity.w + entity.x) &&
            (this.y < entity.y && this.y + this.h > entity.y || this.y < entity.h + entity.y && this.y + this.h > entity.h + entity.y)
        );
    }

    //#region methods
    /**
     * Indicates whether the player is colliding with the entity. 
     * @param {Entity} enity 
     * @returns {Boolean} A boolean that indicates whether the player is colliding with the entity. 
     */
    collide(enityType) {
        if(enityType == "obstacle" && !this.#immunity) {
            this.#immunity = true;
            this.html.classList.remove("walk");
            if(!this.isDie()) {
                this.html.classList.add("hitted");
                setTimeout(()=> {
                    this.html.classList.remove("hitted"); 
                    this.html.classList.add("walk");
                    this.#jumping = false;
                    this.#immunity = false;
                }, 1000);
            } else {
                this.html.classList.add("die");
            }
        }
    }

    jump() {
        if(!this.#jumping) {
            this.#jumping = true;
            this.html.classList.remove("walk");
            this.html.classList.add("jump");
            this.a = setTimeout(()=> {
                this.html.classList.remove("jump"); 
                this.html.classList.add("walk");
                this.#jumping = false;
            }, 1000);
        } else {
            if(!this.#doublejumping) {
                this.#doublejumping = true;
                this.html.style.setProperty("--player-current-y", this.y)
                this.html.classList.remove("jump");
                this.html.classList.add("doublejump"); 
                window.clearTimeout(this.a);
                setTimeout(()=> {
                    this.html.classList.remove("doublejump"); 
                    this.html.classList.add("walk");
                    this.#jumping = false;
                    this.#doublejumping = false;
                }, 1000);
            }
        }
    }

    get lifes() {return this.#lifes}
    get score() {return this.#score} 
    get immunity() {return this.#immunity} 

    set lifes(lifes) {
        this.#lifes = lifes
        document.querySelector(".player-counter.life > div:last-child").innerHTML = this.lifes + "+";
    }
    set score(score) {
        this.#score = score
        document.querySelector(".player-counter.coin > div:last-child").innerHTML = this.score + "+";
    }
    //#endregion
}