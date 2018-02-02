// funzione generaOggetti che, dato un numero n e un array contentenete il nome delle immagini,
// fornisce un array di oggetti. Ogni oggetto rappresenta uno step del gioco
function generaOggetti(n, imagesArray){

  var arraySelezione = []; // array che memorizza gli elementi e che infine verrà ritornato
  var ricordaArray = []; // memorizza gli elemeti già creati
  var r; // indici di supporto alla memorizzazione
  var pr1;
  var pr2;
  var pr3;

  // controllo sull'input del numero di domande
  if (n > imagesArray.length){
    n = imagesArray.length;
  }
  if (n <= 0){
    n = 1;
  }
  // ciclo di popolamento dell'array
  for (var i = 0; i < n ; i++){
    // ogni elemento dell'array da ritornare ha la seguente struttura
    var selezione = { img: "", // percorso immagine
                      tag: "", // tag dell'immagine (parola corretta)
                      parola1: "", // parole per la selezione
                      parola2: "",
                      parola3: "",
                      time_start: "", // tempo di inizio per l'elemento specifico
                      //time_end: "",
                      //parola_scelta: ""
                    };

    // genero un numero per trovare un elemento nell'array e salvarlo
    do{
      r = Math.floor(Math.random() * (imagesArray.length));
    }
    while (ricordaArray.includes(imagesArray[r]) == true); // verifico che non sia già stato preso

    selezione.img = "/images/" + imagesArray[r] + ".jpg"; // salvo l'immagine
    ricordaArray.push(imagesArray[r]); // mi ricordo quale elemento ho preso
    selezione.tag = imagesArray[r]; // salvo il tag

    // estraggo la prima parola per la scelta
    do{
      pr1 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (r == pr1); // verifico che non sia uguale al tag
    selezione.parola1 = imagesArray[pr1]; // salvo la parola

    // estraggo la seconda parola per la scelta
    do{
      pr2 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (pr2==pr1 || pr2==r); // verifico che non sia uguale al tag o alla prima parola
    selezione.parola2 = imagesArray[pr2]; // salvo la parola

    // estraggo la terza parola per la scelta
    do{ pr3 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (pr3==pr2 || pr3==pr1 || pr3==r); // verifico che non sia uguale alle altre precendenti
    selezione.parola3 = imagesArray[pr3]; // salvo la parola
    arraySelezione.push(selezione); // inserimento dell'oggetto nell'array
  }
  return arraySelezione; // ritorno l'array

}

module.exports = generaOggetti;
