export { addDropwDownEvents };

window.callbacks = [];
function addDropwDownEvents() {
    document.querySelectorAll('[data-target-type="drowpdown"]').forEach( btn => {
        const dropwDown = document.querySelector(btn.getAttribute("data-target"))
        btn.onclick = function() { dropwDown.classList.toggle("d-none") }; 
        // window.callbacks.push( 
        //     function(e) { if (e.target != dropwDown&&e.target != btn) { dropwDown.classList.add("d-none")} });
        // window.onclick = (e) => {
        //     window.callbacks.forEach( callback => callback(e) );
        // };
    });
}
