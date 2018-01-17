//Array di immmagini che contiene le immagini
var imagesArray = ["img/aquila.jpg", 
                   "img/cavallo.jpg", 
                   "img/cerbiatto.jpg", 
                   "img/elefante.jpg", 
                   "img/gatto.jpg", 
                   "img/lama.jpg", 
                   "img/maiale.jpg",  
                   "img/orso.jpg", 
                   "img/panda.jpg", 
                   "img/rana.jpg", 
                   "img/ratto.jpg", 
                   "img/riccio.jpg"];

var arraySelezione = [];
/*var selezione = 
  var tag;
  var img;
  var parola1;
  var parola2;
  var parola3;
}*/

function firstImage(){
    //mostra l'immagine all'apertura della pagina
    var r = Math.floor(Math.random() * (imagesArray.length));
    document.canvas.src = imagesArray[r];
}

//funzione che restituisce un'immagine
function displayImage(){
    //creo un numero random da 0 al numero di immagini
    var r = Math.floor(Math.random() * (imagesArray.length));
    //mostra l'immagine da imagesArray array nel canvas image 
    document.canvas.src = imagesArray[r];
}

function generaOggetti(n){
  if (n > imagesArray.length){
    n = imagesArray.length;
  }
  if (n < 0){
    n = 1;
  }

  var selezione = { img:"",
                    tag:"",
                    parola1:"",
                    parola2:"",
                    parola3:""
                  };

  for (var i = 0; i < n ; i++){
    var r = Math.floor(Math.random() * (imagesArray.length));
    selezione.img=imagesArray[r];
    var tmpstr = imagesArray[r];
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.tag= tmpstr;
    console.log(selezione.tag);


    var pr1 = Math.floor(Math.random() * (imagesArray.length));
    tmpstr = imagesArray[pr1];
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola1 = tmpstr;
    console.log("parola1"+selezione.parola1);

    var pr2 = Math.floor(Math.random() * (imagesArray.length));
    tmpstr = imagesArray[pr2];
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola2 = tmpstr;
    console.log("parola2"+selezione.parola2);

    var pr3 = Math.floor(Math.random() * (imagesArray.length));
    tmpstr = imagesArray[pr3];
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola3 = tmpstr;
    console.log("parola3"+selezione.parola3);

    arraySelezione.push(selezione);
  }
}
