export { Entity };

class Entity {
    //#region propperties
    /**
     * @public @property @type {number}  
     */
    #x
    /**
     * @public @property @type {number}  
     */
    #y
    /**
     * @private @property @type {number}  
     */
    #w
    /**
     * @private @property @type {number}  
     */
    #h
    /**
     * @private @property @type {number}  
     */
    /**
     * @private @property @type {HTMLElement}  
     */
    #html
    //#endregion

    //#region constructor
    /**
     * initialize a new instance of a Entity
     * @param {number} x 
     * @param {number} y 
     * @param {number} h 
     * @param {number} w 
     * @param {HTMLElement} html 
     */
    constructor(x, y, h, w, html) {
        this.#x    = x; 
        this.#y    = y; 
        this.#h    = h; 
        this.#w    = w; 
        this.#html = html;
    }
    //#endregion

    //#region methods
    update() {
        this.#html.style.top    = this.#y+"px";
        this.#html.style.left   = this.#x+"px";
        this.#html.style.width  = this.#w+"px";
        this.#html.style.height = this.#h+"px";
    };
    collide() {};

    get x()    {return this.#x}
    get y()    {return this.#y}
    get h()    {return this.#h}
    get w()    {return this.#w}
    get html() {return this.#html}
    
    set x(x) {this.#x = x}
    set y(y) {this.#y = y}
    //#endregion
}