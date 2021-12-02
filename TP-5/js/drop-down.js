export { addDropwDownEvents };

function addDropwDownEvents() {
    document.querySelectorAll('[data-target-type="drowpdown"]').forEach( btn => {
        const dropwDown = document.querySelector(btn.getAttribute("data-target"))
        btn.onclick = function() { dropwDown.classList.toggle("d-none") }; 
        window.onclick = function(event) { if (event.target == dropwDown) { dropwDown.classList.add("d-none")} }
    });
}
