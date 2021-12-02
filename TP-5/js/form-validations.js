export { addFormsValidationsEvents };

function addFormsValidationsEvents() {
    "use strict";

    class FormValidator{

        constructor(input) {
            this.inputContainer = input;
            this.validate = validations[this.input.getAttribute("name")];
        }

        applyValidation() {
            this.helperTextDefault.classList.add("d-none");
            this.helperTextSucces.classList.add("d-none");
            this.helperTextError.classList.add("d-none");
            this.input.classList.remove("border-verde");
            this.input.classList.remove("border-negro");
            this.input.classList.remove("border-rojo");
            return (this.validate(this.input.value)) ? this.success() : this.error(); 
        }

        success() {
            this.helperTextSucces.classList.remove("d-none");
            this.input.classList.add("border-verde");
            return true;
        }

        error() {
            this.helperTextError.classList.remove("d-none")
            this.input.classList.add("border-rojo");
            return false;
        }
        get state() { return this.applyValidation(); }
        get helperTextDefault() { return this.inputContainer.querySelector("p.default"); }
        get helperTextSucces()  { return this.inputContainer.querySelector("p.success"); }
        get helperTextError()   { return this.inputContainer.querySelector("p.error"); }
        get input() { return this.inputContainer.querySelector("input"); }
    }

    const validations = {
        name:  (value) => { return value != "" },
        email: (value) => { return (/^[A-Za-z0-9](([a-zA-Z0-9,=\.!\-#|\$%\^&\*\+/\?_`\{\}~]+)*)@(?:[0-9a-zA-Z-]+\.)+[a-zA-Z]{2,9}$/).test(value) },
        pass1: (value) => { return (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).test(value) },
        pass2: (value) => { return (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).test(value)&&
                            document.querySelector('input[name="pass1"]').value === value },
    }

    const event = {
        form:  (form,  callback) => { form.addEventListenner("submit", (e) => { e.preventDefault(); callback();}) },
        input: (input, callback) => { input.addEventListenner("input", callback) },
    }

    const form = document.querySelector("form");
    const btn = form.querySelector("button");
    const inputs = [];
    document.querySelectorAll(".input-container").forEach(input => inputs.push(new FormValidator(input)) );
    form.addEventListener("submit", (e) => { 
        e.preventDefault(); 
        if(inputs.filter( input => input.applyValidation() === false ).length === 0) {
            btn.innerText = "Siguiente";
        } else {
            btn.innerText = "Validar";
        }
    });
}