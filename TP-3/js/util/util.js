export { Util };

/**
 * Create html element with element set and append child nodes to it
 * @param {String} type 
 * @param {String[]} classes 
 * @param {HTMLElement[]} childs 
 * @param {HTMLElement} parent 
 * @return {HTMLElement} The new HTMLElement thas was created 
 */
 function elt(type, classes = [], childs = [], parent = null) {
    let elt = document.createElement(type);
    classes.forEach(cssClass => elt.classList.add(cssClass));
    childs.forEach( child => {
        if((typeof(child)) == "string"){ child = document.createElement(child)};
        elt.appendChild(child) 
    });
    if(parent) parent.appendChild(elt);
    return elt;
} 

const Util = { elt };
