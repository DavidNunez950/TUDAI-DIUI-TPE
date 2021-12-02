document.addEventListener("DOMContentLoaded", function (event) {
     
     let comentariosVideo = document.getElementById("comentarios-video");
     let btnComentariosVideo = document.getElementById("btn-comentarios-video");
     let containerInputComentar = document.getElementById("container-input-comentar");
     let btnComentar = document.getElementById("btn-comentar");
     let btnLike = document.getElementById("btn-like");
     let likes = document.getElementById("cantidad-likes");
     let inputComentario = document.getElementById("input-comentario");
     let btnEnviarComentario = document.getElementById("btn-enviar-comentario");
     let notificaciones = document.getElementById('notificaciones');
     let btnNotificaciones = document.getElementById('btn-notificaciones');
     let nombreUsuario = "Agustina Notti";
     let respuestasComentario = document.getElementById("respuestas-comentarios");
     let btnVerRespuestasComentario = document.getElementById("btn-ver-respuestas");


     btnVerRespuestasComentario.addEventListener("click", ()=>{
          respuestasComentario.classList.toggle('display');
     });

     btnNotificaciones.addEventListener("click", ()=>{
          notificaciones.classList.toggle('display');
     });

     btnEnviarComentario.addEventListener("click", ()=>{
          appendComentario();
          inputComentario.value = "";

          if(comentariosVideo.classList.contains("display")) {
               containerInputComentar.classList.remove("display");
               comentariosVideo.classList.remove("display");
          }
     });

     btnLike.addEventListener("click", () => {
          let cantLikes = parseInt(likes.innerText);
          if (btnLike.classList.contains("like")) {
               btnLike.classList.remove("like");
               cantLikes -= 1;
               likes.innerHTML = cantLikes;
          } else {
               btnLike.classList.add("like");
               cantLikes += 1;
               likes.innerHTML = cantLikes;
          }
     });

     btnComentariosVideo.addEventListener("click", () => {
          if (
               comentariosVideo.classList.contains("display") &&
               containerInputComentar.classList.contains("display")
          ) {
               containerInputComentar.classList.remove("display");
               comentariosVideo.classList.remove("display");
          } else {
               containerInputComentar.classList.add("display");
               comentariosVideo.classList.add("display");
          }
     });

     btnComentar.addEventListener("click", () => {
          if (!comentariosVideo.classList.contains("display")) {
               comentariosVideo.classList.add("display");
          }

          if (containerInputComentar.classList.contains("display")) {
               containerInputComentar.classList.remove("display");
          } else {
               containerInputComentar.classList.add("display");
          }
     });

     function appendComentario() {
          /**Crear elementos */
          let divContenedor = document.createElement("div");
          let imgComentario = document.createElement("img");
          let div1 = document.createElement("div");
          let div2 = document.createElement("div");
          let div3 = document.createElement("div");
          let div4 = document.createElement("div");
          let pNombre = document.createElement("p");
          let pComentario = document.createElement("p");
          let aMeGusta = document.createElement("a");
          let aResponder = document.createElement("a");
          let pFechoHora = document.createElement("p");
          let btnMenuComentario = document.createElement("button");

          /**Agregar clases y atributos*/
          divContenedor.classList.add("d-flex", "align-items-center");
          imgComentario.classList.add("img-size-4", "m-15");
          imgComentario.setAttribute("src", "./images/perfil3.png");
          imgComentario.setAttribute("alt", "avatar de mensaje");
          div1.classList.add("d-flex", "flex-col");
          div2.classList.add("p-10", "rounded-1", "bg-color-gris-2", "m-t-15");
          div3.classList.add("d-flex", "align-items-center");
          div4.classList.add("d-flex", "justify-content-between", "align-items-center");
          pNombre.classList.add("font-body-3", "font-color-gris-3");
          pComentario.classList.add(
               "font-body-2",
               "font-color-negro",
               "text-align-justify"
          );
          aMeGusta.classList.add(
               "font-body-4",
               "font-color-gris-3",
               "m-l-10",
               "p-t-5",
               "bold"
          );
          aResponder.classList.add(
               "font-body-4",
               "font-color-gris-3",
               "m-l-10",
               "p-t-5",
               "bold"
          );
          pFechoHora.classList.add(
               "font-body-4",
               "font-color-gris-3",
               "m-l-10",
               "p-t-5"
          );
          btnMenuComentario.classList.add("p-5");

          /**Agregar contenido */
          pNombre.innerHTML = nombreUsuario;
          pComentario.innerHTML = inputComentario.value;
          aMeGusta.innerHTML = "Me Gusta";
          aResponder.innerHTML = "Responder";
          let datetime = new Date();
          pFechoHora.innerHTML = datetime.toDateString();
          btnMenuComentario.innerHTML = "<i class='fas fa-ellipsis-v icon-size-4'></i>";

          /**append */
          /**div4 */
          div4.appendChild(pNombre);
          div4.appendChild(btnMenuComentario);

          /**div 2 */
          div2.appendChild(div4);
          div2.appendChild(pComentario);

          /**div 3 */
          div3.appendChild(aMeGusta);
          div3.appendChild(aResponder);
          div3.appendChild(pFechoHora);

          /**div 1 */
          div1.appendChild(div2);
          div1.appendChild(div3);

          /**div contenedor */
          divContenedor.appendChild(imgComentario);
          divContenedor.appendChild(div1);

          /**container de comentarios */
          comentariosVideo.appendChild(divContenedor);
     }

  /**
   * divContenedor
     <div class="d-flex align-items-center">
          <img class="img-size-4 m-15" src="./images/perfil2.png" alt="avatar de mensaje">
          div1
          <div class="d-flex flex-col">
               div2
               <div class="p-10 rounded-1 bg-color-gris-2 m-t-15">
                    div4
                    <div class="d-flex justify-content-between align-items-center">
                         <p class="font-body-3 font-color-gris-3">Juan Perez</p>
                         <button class="margin-r-l"><i class="fas fa-ellipsis-v icon-size-4 "></i></button>
                    </div>
                    <p class="font-body-2 font-color-negro text-align-justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
               </div>

               div3
               <div class="d-flex align-items-center" >
                    <a href="" class="font-body-4 font-color-gris-3 m-l-10 p-t-5 bold">Me gusta</a>                               
                    <a href="" class="font-body-4 font-color-gris-3 m-l-10 p-t-5 bold">Responder</a>
                    <p class="font-body-4 font-color-gris-3 m-l-10 p-t-5">26 min</p>
               </div>
          </div>
     </div>
     */
});
