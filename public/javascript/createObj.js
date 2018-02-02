// funzione generaOggetti che, dato un numero n e un array contentenete il nome delle immagini,
// fornisce un array di oggetti. Ogni oggetto rappresenta uno step del gioco
function createObj(n, imagesArray){

  var arraySelection = []; // array che memorizza gli elementi e che infine verrà ritornato
  var arrayRemember = []; // memorizza gli elemeti già creati
  var r; // indici di supporto alla memorizzazione
  var wr1;
  var wr2;
  var wr3;

  // viene fatto un controllo  sull'input del numero di domande
  if (n > imagesArray.length){
    n = imagesArray.length;
  }
  if (n <= 0){
    n = 1;
  }
  // ciclo di popolamento dell'array
  for (var i = 0; i < n ; i++){
    // ogni elemento dell'array da ritornare ha la seguente struttura
    var objToPush = { img: "", // percorso immagine
                      tag: "", // tag dell'immagine (parola corretta)
                      word1: "", // parole per la selezione
                      word2: "",
                      word3: "",
                      time_start: "", // tempo di inizio per l'elemento specifico
                      //time_end: "",
                      //parola_scelta: ""
                    };

    // viene generato un numero casuale per trovare un elemento nell'array e salvarlo
    do{
      r = Math.floor(Math.random() * (imagesArray.length));
    }
    while (arrayRemember.includes(imagesArray[r]) == true); // viene verificato che non sia già stato preso

    objToPush.img = "/images/" + imagesArray[r] + ".jpg"; // salvo l'immagine
    arrayRemember.push(imagesArray[r]); // tengo traccia dell'elemento preso
    objToPush.tag = imagesArray[r]; // salvo il tag

    // viene estratta la prima parola per la scelta
    do{
      wr1 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (r == wr1); // viene verificato che non sia uguale al tag
    objToPush.word1 = imagesArray[wr1]; // viene salvata la parola

    // viene estratta la seconda parola per la scelta
    do{
      wr2 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (wr2==wr1 || wr2==r); // viene verificato che non sia uguale al tag o alla prima parola
    objToPush.word2 = imagesArray[wr2]; // viene salvata la parola

    // viene estratta la terza parola per la scelta
    do{ wr3 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (wr3==wr2 || wr3==wr1 || wr3==r); // viene verificato che non sia uguale alle altre precendenti
    objToPush.word3 = imagesArray[wr3]; // viene salvata la parola
    arraySelection.push(objToPush); // viene inserito l'oggetto nell'array
  }
  return arraySelection; // viene ritornato l'array

}

module.exports = createObj;
