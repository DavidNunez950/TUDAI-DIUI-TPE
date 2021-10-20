export { Util };

/**
 * @typedef Attribute 
 * @prop {String} name  the attribute name
 * @prop {String} value the attribute value   
 */

/**
 * Create html element with element set and append child nodes to it
 * @param {String} type 
 * @param {Attribute[]} attrs 
 * @param {HTMLElement} parent 
 * @param {HTMLElement[]} childs 
 * @return {HTMLElement} The new HTMLElement thas was created 
 */
function elt(type, attrs, parent = null, childs = []) {
    let elt = document.createElement(type);
    attrs.forEach(attr => elt.setAttribute(attr.name, attr.value) );
    childs.forEach( child => {
        if((typeof(child)) == "string") child = document.createElement(child);
        elt.appendChild(child) 
    });
    if(parent) parent.appendChild(elt);
    return elt;
}

const Util = { elt };
