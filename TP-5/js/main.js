import { startLoading } from './loading.js';
import { addModalEvents } from './modal.js';
import { addDropwDownEvents } from './drop-down.js';
import { addSearchFilterEvents } from './search-filter.js';
import { addFormsValidationsEvents } from './form-validations.js';

startLoading();
addModalEvents();
addDropwDownEvents();

switch((/(.*)\/(.*?).html/).exec(window.location).pop()) {
    case "busqueda":
        addSearchFilterEvents()
        break;
    case "registro_1":
        addFormsValidationsEvents();
        break;
    case "login":
        addFormsValidationsEvents();
        break;
    default:
        break;
}
