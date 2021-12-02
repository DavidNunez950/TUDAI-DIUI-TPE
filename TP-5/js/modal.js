
export { addModalEvents };

function addModalEvents() {
    document.querySelectorAll('[data-target-type="modal"]').forEach( btn => {
        const modal = document.querySelector(btn.getAttribute("data-target"))
        const span = modal.getElementsByClassName("close")[0];
        btn.onclick = function() { modal.style.display = "block" };
        span.onclick = function() { modal.style.display = "none" }; 
        window.onclick = function(event) { if (event.target == modal) { modal.style.display = "none"; } }
    });
}
