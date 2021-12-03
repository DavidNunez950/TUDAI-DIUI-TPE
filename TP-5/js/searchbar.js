export { addSearhBarEvent }
function addSearhBarEvent() {
    const seacrhbar = document.querySelector("#search-input");
    if(seacrhbar) {
        seacrhbar.addEventListener("keyup", (e) => {
            if((e.which || e.keyCode) == 13) {
                window.location.assign("busqueda.html");
            }
        });
    }
}