import { startLoading } from './loading.js';
import { addModalEvents } from './modal.js';
import { addSearchFilterEvents } from './search-filter.js';
import { addFormsValidationsEvents } from './form-validations.js';

startLoading();
addModalEvents();

switch((/(.*)\/(.*?).html/).exec(window.location).pop()) {
    case "busqueda":
        addSearchFilterEvents()
        break;
    case "registro_1":
        addFormsValidationsEvents();
    default:
        break;
}
