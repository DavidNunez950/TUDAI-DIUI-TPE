export { addSearchFilterEvents };

function addSearchFilterEvents() {
    const select       = document.querySelector(".select select");
    const selectText   = document.querySelector(".select-text");
    const selectNumber = document.querySelector(".select-number");
    select.addEventListener("click", (e) => {
        if (e.target.tagName === "OPTION") {
            let type = e.target.getAttribute("data-type");
            select.setAttribute("data-type-selected", type)
            if(type === "text") {
                selectText.classList.remove("d-none")
                selectNumber.classList.add("d-none")
            } else {
                selectText.classList.add("d-none")
                selectNumber.classList.remove("d-none")
            }
        }
    });

    const filterContainer = document.querySelector(".filters-container");
    const addFilter = document.querySelector(".search-filter");
    const btnAdd = addFilter.querySelector("button");
    const input = addFilter.querySelector("input");
    btnAdd.addEventListener("click", () => {
        if(input.value !== "") {
            const operation = ((!selectText.classList.contains("d-none"))? selectText : selectNumber).querySelector("select");
              
            let filter = 
            `<div class="p-10 bg-color-blanco rounded-1 d-flex flex-row align-items-center m-l-10 m-t-10">
                <p class="font-body-2 font-color-negro p-r-10">${ select.selectedOptions["0"].innerText } <b class="font-color-gris-3">${ operation.selectedOptions["0"].innerText }</b> ${input.value}</p>
                <i class="fas fa-times-circle icon-size-3"></i>
            </div>`;
            filterContainer.innerHTML +=filter;
        }
    });
    filterContainer.addEventListener("click", (e)=> {
        if (e.target.tagName === "I" && e.target.classList.contains("fa-times-circle")) {
            filterContainer.removeChild(e.target.parentElement);
        }
    });
}


