var esercizi = [
  {
    link: "img/aquila.jpg",
    corretta: "aquila",
    sbagliate: ["cavallo", "cerbiatto", "elefante"]
  }
];


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

var arraySelezione = []; //Array che verrà popolato dalla funzione "genera oggetti"

/*Funzione che carica la prima immagine appena si avvia la pagina*/
function firstImage(){
    //mostra l'immagine all'apertura della pagina
    var r = Math.floor(Math.random() * (imagesArray.length));
    document.canvas.src = imagesArray[r];
}

//funzione che restituisce un'immagine casuale senza controllare duplicati
function displayImage(){
    //creo un numero random da 0 al numero di immagini
    var r = Math.floor(Math.random() * (imagesArray.length));
    //mostra l'immagine da imagesArray array nel canvas image 
    document.canvas.src = imagesArray[r];
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
                    parola3: ""
                    };
    console.log("ITERAZIONE "+i);
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
    console.log("tag " + selezione.tag);

    //Estraggo la prima parola per la scelta
    var pr1;
    do{ 
      pr1 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (selezione.img==imagesArray[pr1]); // verifico che non sia uguale al tag
    tmpstr = imagesArray[pr1]; // inizio procedura di "ritaglio" della parola
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola1 = tmpstr;
    console.log("parola1 "+selezione.parola1);

    //Estraggo la seconda parola per la scelta
    var pr2;
    do{ 
      pr2 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (pr2==pr1 || pr2==r); //verifico che non sia uguale al tag o alla prima parola
    tmpstr = imagesArray[pr2]; // ritaglio
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola2 = tmpstr;
    console.log("parola2 "+selezione.parola2);

    //Estraggo la terza parola per la scelta
    var pr3;
    do{ pr3 = Math.floor(Math.random() * (imagesArray.length));
    }
    while (pr3==pr2 || pr3==pr1 || pr3==r); //verifico che non sia uguale alle altre precendenti
    tmpstr = imagesArray[pr3];
    tmpstr = tmpstr.substring(4, tmpstr.length - 4);
    selezione.parola3 = tmpstr; //ritaglio
    console.log("parola3 "+selezione.parola3);

      arraySelezione.push(selezione);
     //salvo nell'array l'oggetto
      //console.log(i+"tag "     + arraySelezione[i].tag);
      //console.log(i+"parola1 " + arraySelezione[i].parola1);
      //console.log(i+"parola2 " + arraySelezione[i].parola2);
      //console.log(i+"parola3 " + arraySelezione[i].parola3);
      //console.log("selezione");
      //console.log(selezione);
  }
  
  console.log(arraySelezione);

  
}

function stampa(n)
{
  for (var j=0; j < n; j++){
      console.log(j+"tag "     + arraySelezione[j].tag);
      console.log(j+" DIO " + arraySelezione[j].parola1);
      console.log(j+" DIO " + arraySelezione[j].parola2);
      console.log(j+" DIO " + arraySelezione[j].parola3);
  }
}
