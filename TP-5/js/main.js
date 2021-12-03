import { startLoading } from './loading.js';
import { addModalEvents } from './modal.js';
import { addDropwDownEvents } from './drop-down.js';
import { addSearchFilterEvents } from './search-filter.js';
import { addFormsValidationsEvents } from './form-validations.js';
import { addSearhBarEvent } from './searchbar.js';

addModalEvents();
addSearhBarEvent();
addDropwDownEvents();

switch((/(.*)\/(.*?).html/).exec(window.location).pop()) {
    case "busqueda":
        addSearchFilterEvents()
        startLoading();
        break;
    case "registro_1":
        addFormsValidationsEvents();
        break;
    case "registro_2":
        addFormsValidationsEvents();
        break;
    case "registro_3":
        addFormsValidationsEvents();
        break;
    case "login":
        addFormsValidationsEvents();
        break;
    case "mensajes":
        break;
    case "muro-noticias":
        startLoading();
        break;
    default:
        break;
}
