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
     * @public @property @type {String}  
     */
    #type
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
    constructor(x, y, h, w, type, html) {
        this.#html = html;
        this.#html.classList.add("entity");
        this.#x    = x; 
        this.#y    = y; 
        // this.#html.style.top    = this.#y+"px";
        // this.#html.style.left   = this.#x+"px";
        this.#type =  type;
    }
    //#endregion

    //#region methods
    update() {
        // this.#html.style.top    = this.#y+"px";
        // this.#html.style.left   = this.#x+"px";
        // this.#html.style.width  = this.#w+"px";
        // this.#html.style.height = this.#h+"px";
        this.#w = this.#html.clientWidth ;
        this.#h = this.#html.clientHeight;
    };
    collide() {};

    get x()    {return parseInt(window.getComputedStyle(this.html).getPropertyValue("left"))}
    get y()    {return parseInt(window.getComputedStyle(this.html).getPropertyValue("top"))}
    get h()    {return this.#h}
    get w()    {return this.#w}
    get html() {return this.#html}
    get type() {return this.#type}
    
    set x(x) {this.#x = x}
    set y(y) {this.#y = y}
    //#endregion
}