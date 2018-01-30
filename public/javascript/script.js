//funzione che ritorna il time stamp, in millisecondi attuale
function getTimeNow(){
  var d = new Date();
  var t = d.getTime();
  return t;
}

// funzione che calcola la differenza in secondi tra due date passate
// in modo che sia facilmente leggibile l'output
function diffTime(d1, d2){
  var diff =(d2 - d1) / 1000;
  //diff /= 60;
  return Math.abs(Math.round(diff));
}

// funzione che prende un array in ingresso e mixa il contenuto
// utilizzata in quanto l'oggetto contentenete l'immagine corrente altrimenti
// verrebbe visualizzata sempre la giusta parola associata all'immagine al primo posto
function getMixWord(objImg){
  var wordList = [objImg.tag, objImg.parola1, objImg.parola2, objImg.parola3];
  shuffle(wordList);
  return wordList;
}

// funzione che fa lo shuffle di un array
// per fare lo shuffle dell'array viene utilizzato l'algoritmo "Fisher–Yates shuffle"
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}
