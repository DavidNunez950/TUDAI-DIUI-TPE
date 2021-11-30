document.addEventListener("DOMContentLoaded", function(event) {
    
    let comentariosVideo = document.getElementById('comentarios-video');
    let btnComentariosVideo = document.getElementById('btn-comentarios-video');
    let inputComentar = document.getElementById('input-comentar');
    let btnComentar = document.getElementById('btn-comentar');
    let btnLike = document.getElementById('btn-like');
    let likes = document.getElementById('cantidad-likes');
    

    btnLike.addEventListener('click', ()=>{
          let cantLikes = parseInt(likes.innerText);
          if(btnLike.classList.contains('like')){
               btnLike.classList.remove('like');
               cantLikes -= 1;
               likes.innerHTML = cantLikes;
          } else {
               btnLike.classList.add('like');
               cantLikes += 1;
               likes.innerHTML = cantLikes;
          }
    });

    btnComentariosVideo.addEventListener('click', ()=>{
     if(comentariosVideo.classList.contains('display') && inputComentar.classList.contains('display') ){
          inputComentar.classList.remove('display');
          comentariosVideo.classList.remove('display');
     } else {
          inputComentar.classList.add('display');
          comentariosVideo.classList.add('display');
     }
   });

   btnComentar.addEventListener('click', ()=>{
     if(!comentariosVideo.classList.contains('display')){
          comentariosVideo.classList.add('display');
     }

     if(inputComentar.classList.contains('display')){
          inputComentar.classList.remove('display');
     } else {
          inputComentar.classList.add('display');
     }
   });
});