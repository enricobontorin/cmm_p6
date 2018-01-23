function generaOggetti(n, imagesArray){
    //Ogni oggetto creato avrà la seguente struttura
    
  /*var imagesArray = ["aquila", 
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
                   "riccio"];*/
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
  //return arraySelezione;
  console.log(arraySelezione);
}


module.exports = generaOggetti;
