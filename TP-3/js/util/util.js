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
 * @param {HTMLElement[]} childs 
 * @return {HTMLElement} The new HTMLElement thas was created 
 */
function elt(type, attrs, childs) {
    let elt = document.createElement(type);
    attrs.forEach(attr => elt.setAttribute(attr.name, attr.value) );
    childs.forEach(child => elt.appendChild(child) );
    return elt;
}

const Util = { elt };
