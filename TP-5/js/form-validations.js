export { addFormsValidationsEvents };

function addFormsValidationsEvents() {
    "use strict";

    class FormValidator{

        constructor(input) {
            this.inputContainer = input;
            this.validate = validations[this.input.getAttribute("name")];
        }

        resetSyle(el) {
            switch(el.tagName) {
                case "INPUT":
                    el.classList.remove("border-rojo");
                    el.classList.remove("border-verde");
                    break;
                case "I":
                    el.classList.add("d-none");
                    el.classList.add("d-none");
                    break;
                case "P":
                    el.classList.remove("font-color-rojo");
                    el.classList.remove("font-color-verde");
                    break;
            }
        }

        applyValidation() {
            ([this.getDefaultMessague, this.input, this.iconSuccess(this.getDefaultMessague), this.iconError(this.getDefaultMessague)]).forEach( el => this.resetSyle(el) );
            return (this.validate(this.input.value)) ? this.success() : this.error(); 
        }

        success(input = this.input, messagues = [this.getDefaultMessague]) {
            messagues.forEach( messague =>  {
                messague.classList.add("font-color-verde");
                this.iconSuccess(messague).classList.remove("d-none")
            });
            input.classList.add("border-verde");
            return true;
        }

        error(input = this.input, messagues = [this.getDefaultMessague]) {
            messagues.forEach( messague =>  {
                messague.classList.add("font-color-rojo");
                this.iconError(messague).classList.remove("d-none")
            });
            input.classList.add("border-rojo");
            return false;
        }
        
        iconError  (p = this.getDefaultMessague) { return p.querySelector("i.fa-exclamation-triangle"); }
        iconSuccess(p = this.getDefaultMessague) { return p.querySelector("i.fa-check-circle"); }
        get helperTextDefault() { return this.inputContainer.querySelector("p.default"); }
        get getDefaultMessague() { return this.inputContainer.querySelector("p.default"); }
        get input() { return this.inputContainer.querySelector("input"); }
    }
    class FormValidatorPass extends FormValidator {
        constructor(input) { 
            super(input); 
            this.validate = (value) => {
                let success = [], errors = []; 
                (((/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).test(value))
                                           ? success : errors).push(helperTextCantCaracters);
                (((/([a-z])/).test(value)) ? success: errors).push(helperTextLetterMin);
                (((/([A-Z])/).test(value)) ? success: errors).push(helperTextLetterMay);
                (((/([0-9])/).test(value)) ? success: errors).push(helperTextEsp);
                (((/([#?!@$ %^&*-])/).test(value)) ? success: errors).push(helperTextEsp);
                return {success, errors};
            }
        }
        
                        
        applyValidation() {
            let {success, errors} =  this.validate(this.input.value);
            console.log("🚀 ~ file: form-validations.js ~ line 78 ~ FormValidatorPass ~ applyValidation ~ success, errors", success, errors)
            this.success(this.input, success);
            this.error(this.input, errors);
            return  false;
        }

        get helperTextCantCaracters()  { return this.inputContainer.querySelector("p.cant-caracters"); }
        get helperTextLetterMin()  { return this.inputContainer.querySelector("p.letter-min"); }
        get helperTextLetterMay()  { return this.inputContainer.querySelector("p.letter-may"); }
        get helperTextNum() { return this.inputContainer.querySelector("p.num"); }
        get helperTextEsp() { return this.inputContainer.querySelector("p.esp"); }
    }

    const validations = {
        name:  (value) => { return value != "" },
        email: (value) => { return (/^[A-Za-z0-9](([a-zA-Z0-9,=\.!\-#|\$%\^&\*\+/\?_`\{\}~]+)*)@(?:[0-9a-zA-Z-]+\.)+[a-zA-Z]{2,9}$/).test(value) },
        // pass1: (value) => { return (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).test(value) },
        pass1: (value) => { 
            
            return (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).test(value) 
        },
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
    document.querySelectorAll(".input-container").forEach( input =>
        inputs.push(((input.getAttribute("name")!=="pass1") ? new FormValidator(input) : new FormValidatorPass(input)) ) 
    );
    form.addEventListener("submit", (e) => { 
        e.preventDefault(); 
        if(inputs.filter( input => input.applyValidation() === false ).length === 0) {
            btn.innerText = "Siguiente";
        } else {
            btn.innerText = "Validar";
        }
    });
}