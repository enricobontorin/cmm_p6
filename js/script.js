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
  //Array di immmagini che contiene le immagini
  var imagesArray = ["img/cane.jpg",
                     "img/gatto.jpg",
                     "img/leone.jpg",
                     "img/panda.jpg",
                     "img/papera.jpg",
                     "img/tigre.jpg",
                     "img/squalo.jpg",
                     "img/coniglio.jpg",
                     "img/rana.jpg",
                     "img/orso.jpg",
                     "img/giraffa.jpg",
                   ];
  //Ogni oggetto creato avrà la seguente struttura
  var arraySelezione = []; //Array che verrà popolato dalla funzione "genera oggetti"

  var ricordaArray = []; //memorizza gli elemeti già creati

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
                      parola_scelta:""
                    };

    //genero un numero per trovare un elemento nell'array e salvarlo
    do{
      var r = Math.floor(Math.random() * (imagesArray.length));
    }
    while (ricordaArray.includes(imagesArray[r])==true); //verifico che non sia già stato preso

    selezione.img=imagesArray[r]; //salvo l'immagine
    ricordaArray.push(imagesArray[r]); //mi ricordo quale elemento ho preso
    var tmpstr = imagesArray[r]; //inizio procedura di "ritaglio del tag"
    tmpstr = tmpstr.substring(4, tmpstr.length - 4); //tagli la stringa per avere solo il nome dell'immagine
    selezione.tag= tmpstr;// salvo il tag

    //Estraggo la prima parola per la scelta
    var pr1;
    do{
      pr1 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (selezione.img==imagesArray[pr1]); // verifico che non sia uguale al tag
    tmpstr = imagesArray[pr1]; // inizio procedura di "ritaglio" della parola
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola1 = tmpstr;

    //Estraggo la seconda parola per la scelta
    var pr2;
    do{
      pr2 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (pr2==pr1 || pr2==r); //verifico che non sia uguale al tag o alla prima parola

    tmpstr = imagesArray[pr2]; // ritaglio
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola2 = tmpstr;

    //Estraggo la terza parola per la scelta
    var pr3;
    do{ pr3 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (pr3==pr2 || pr3==pr1 || pr3==r); //verifico che non sia uguale alle altre precendenti
    tmpstr = imagesArray[pr3];
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola3 = tmpstr; //ritaglio
      arraySelezione.push(selezione);
  }

  return arraySelezione;
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

function getMixWord(objImg){
  var wordList = [objImg.tag, objImg.parola1, objImg.parola2, objImg.parola3];
  shuffle(wordList);
  return wordList;
}

/**
 * Shuffles array in place. Fisher–Yates shuffle algorithm
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}
