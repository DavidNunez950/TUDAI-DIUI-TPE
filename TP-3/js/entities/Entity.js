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
     * @param {String} type 
     * @param {HTMLElement} html 
     */
    constructor(type, html) {
        this.#html = html;
        this.#html.classList.add("entity");
        this.#type =  type;
    }
    //#endregion

    //#region methods

    collide() {};

    get x()    {return parseInt(window.getComputedStyle(this.html).getPropertyValue("left"))}
    get y()    {return parseInt(window.getComputedStyle(this.html).getPropertyValue("top"))}
    get h()    {return this.#html.clientHeight}
    get w()    {return this.#html.clientWidth}
    get html() {return this.#html}
    get type() {return this.#type}

    //#endregion
}