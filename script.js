/*var esercizi = [
  {
    link: "img/aquila.jpg",
    corretta: "aquila",
    sbagliate: ["cavallo", "cerbiatto", "elefante"]
  }
];*/


//Array di immmagini che contiene le immagini
/*
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
*/
/*
var arraySelezione = []; //Array che verrà popolato dalla funzione "genera oggetti"
*/
/*Funzione che carica la prima immagine appena si avvia la pagina*/

function firstImage(){
    /*
    //mostra l'immagine all'apertura della pagina
    var r = Math.floor(Math.random() * (imagesArray.length));
    document.canvas.src = imagesArray[r];
    */
}


//funzione che restituisce un'immagine casuale senza controllare duplicati

function displayImage(){
    /*
    //creo un numero random da 0 al numero di immagini
    var r = Math.floor(Math.random() * (imagesArray.length));
    //mostra l'immagine da imagesArray array nel canvas image 
    document.canvas.src = imagesArray[r];
    */
}


/*
Genera una lista di oggetti che contengono
percorso immagine
tag
parola1
parola2
parola3
La funzione prevede il controllo sui duplicati
non ci sono duplicati sui tag
non ci sono duplicati tra tag/parola1/parola2/parola3
*/
function generaOggetti(n){
    //Ogni oggetto creato avrà la seguente struttura
    
  var imagesArray = ["aquila", 
                   "cavallo", 
                   "cerbiatto", 
                   "elefante", 
                   "gatto", 
                   "lama", 
                   "maiale",  
                   "orso", 
                   "panda", 
                   "rana", 
                   "ratto", 
                   "riccio"];
  var arraySelezione = [];
  var ricordaArray = []; //memorizza gli elemeti già creati
  var r;
  var pr1;
  var pr2;
  var pr3;
  //var tmpstr;

  //controllo sull'input del numero di domande
  if (n > imagesArray.length){
    n = imagesArray.length;
  }
  if (n < 0){
    n = 1;
  }

  for (var i = 0; i < n ; i++){
    var selezione = { img: "", //percorso immagine
                      tag: "", //tag dell'immagine
                      parola1: "", //parole per la selezione
                      parola2: "",
                      parola3: "",
                      time_start: "",
                      time_end: "",
                      parola_scelta: ""
                    };

    //console.log("ITERAZIONE " + i);
    //genero un numero per trovare un elemento nell'array e salvarlo
    do{ 
      r = Math.floor(Math.random() * (imagesArray.length));
    }
    while (ricordaArray.includes(imagesArray[r]) == true); //verifico che non sia già stato preso
    
    selezione.img = "img/" + imagesArray[r] + ".jpg"; //salvo l'immagine 
    ricordaArray.push(imagesArray[r]); //mi ricordo quale elemento ho preso
    selezione.tag = imagesArray[r];// salvo il tag
    //console.log("tag " + selezione.tag);

    //Estraggo la prima parola per la scelta
    do{ 
      pr1 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (selezione.img == imagesArray[pr1]); // verifico che non sia uguale al tag
    selezione.parola1 = imagesArray[pr1];
    //console.log("parola1 "+ selezione.parola1);

    //Estraggo la seconda parola per la scelta
    do{ 
      pr2 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (pr2==pr1 || pr2==r); //verifico che non sia uguale al tag o alla prima parola
    selezione.parola2 = imagesArray[pr2];
    //console.log("parola2 "+ selezione.parola2);

    //Estraggo la terza parola per la scelta
    do{ pr3 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (pr3==pr2 || pr3==pr1 || pr3==r); //verifico che non sia uguale alle altre precendenti
    selezione.parola3 = imagesArray[pr3]; //ritaglio
    //console.log("parola3 "+ selezione.parola3);
    arraySelezione.push(selezione);
  }
  return arraySelezione;
  //console.log(arraySelezione);
}

function getTimeNow(){
  var d = new Date();
  var t = d.getTime();
  return t;
}

function diffTime(d1, d2){
  var diff =(d2 - d1) / 1000;
  /*diff /= 60;*/
  return Math.abs(Math.round(diff));  
}
