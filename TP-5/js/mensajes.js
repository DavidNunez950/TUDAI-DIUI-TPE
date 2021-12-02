document.addEventListener("DOMContentLoaded", function (event) {
     
   
    
    let btnEnviarMensaje = document.getElementById("btn-enviar-mensaje");
    let notificaciones = document.getElementById('notificaciones');
    let btnNotificaciones = document.getElementById('btn-notificaciones');
    let inputChat = document.getElementById('input-chat');
    let containerConversacion = document.getElementById('container-conversacion');
    
    
    btnEnviarMensaje.addEventListener("click", ()=>{
         appendMensaje();
         inputChat.value = "";
    });

    btnNotificaciones.addEventListener("click", ()=>{
        notificaciones.classList.toggle('display');
   });


    /* 
    divContenedor
    <div class="d-flex align-items-start margin-r-l p-t-15">
        div1
        <div>
            <img src="./images/perfil3.png" alt="Avatar" class="img-size-4">
        </div>

        div2
        <div>
            div3
            <div class="bg-color-blanco rounded-1 p-10 m-5">
                <p class="font-body-3 font-color-negro">Hola! como te fue con el trabajo?</p>
            </div>

            div4
            <div class="m-l-5">
                <p class="font-body-4 font-color-gris-3"> 18:40 pm</p>
            </div>
        </div>
    </div> */
    

    function appendMensaje() {
         /**Crear elementos */
         let divContenedor = document.createElement("div");
         let imgMensaje = document.createElement("img");
         let div1 = document.createElement("div");
         let div2 = document.createElement("div");
         let div3 = document.createElement("div");
         let div4 = document.createElement("div");
         let pMensaje = document.createElement("p");
         let pFechoHora = document.createElement("p");

         /**Agregar clases y atributos*/
         divContenedor.classList.add("d-flex", "align-items-start", "margin-r-l", "p-t-15");
         imgMensaje.classList.add("img-size-4");
         imgMensaje.setAttribute("src", "./images/perfil3.png");
         imgMensaje.setAttribute("alt", "avatar de mensaje");
         div3.classList.add("bg-color-blanco", "rounded-1", "p-10", "m-5");
         div4.classList.add("m-l-5");
         pMensaje.classList.add("font-body-3","font-color-negro");         
         pFechoHora.classList.add("font-body-4", "font-color-gris-3");

         /**Agregar contenido */
         pMensaje.innerHTML = inputChat.value;
         pFechoHora.innerHTML = "18:40 pm"; /**buscar para poner la hora actual */

         /**append */
         /**div4 */
         div4.appendChild(pFechoHora);

         /**div 3 */
         div3.appendChild(pMensaje);

         /**div 2 */
         div2.appendChild(div3);
         div2.appendChild(div4);

         /**div 1 */
         div1.appendChild(imgMensaje);

         /**div contenedor */
         divContenedor.appendChild(div1);
         divContenedor.appendChild(div2);

         /**container de conversacion */
         containerConversacion.appendChild(divContenedor);
    }

 
});
