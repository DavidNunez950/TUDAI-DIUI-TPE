
export { startLoading };
function startLoading() {
    document.querySelector("section").classList.add("d-none");
    setTimeout(() => {
        document.querySelector(".loading").classList.add("fade-out");
        setTimeout(() => {
            document.querySelector(".loading").classList.add("d-none");
            document.querySelector("section").classList.remove("d-none")    
        }, 1000);
    }, Math.random() * 1000);
}