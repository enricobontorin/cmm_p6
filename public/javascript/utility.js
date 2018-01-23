$(document).ready(function(){
    // variabile che contiene il numero di immagini da caricare per la sessione di gioco corrente
    var objNumber;
    // variabile che contiene l'array di oggetti immagine generati casualmente di length objnumber
    var arrayImg;
    // contatore del numero di immagini giocate
    var arrayCount = 0;

    // oggetto che poi verrà passato nel campo della richiesta api per caricare
    // la singola immagine giocata, esito e tempo impiegato nel decidere la parola associata
    var objLoad = {
      id : "",
      tag: "",
      time_stamp: "",
      scelta: "",
      time_word: ""
    };

    // root su cui andare a fare la richiesta fetch
    var root = "http://localhost:8080/api";
    // var root = "https://cmm-p6.herokuapp.com/api" //heroku url

    // quando viene cliccato il bottone che si presenta nella schemata di login
    // viene prelevato l'user name e viene fatta una richiesta ad una nostra API
    // che ritorna le sessioni di gioco che sono state assegnate allo specifico utente
    // inserito nell'user name
    $("#big-button-start").click(function(){
      if(!document.getElementById("usr").value){
        $("#alertNoUsr").show("slow");
        return;

      }
      else{
      // prelevo user name
      objLoad.id = document.getElementById("usr").value;
      //nascondo il frame di login
      $("#login").hide("slow");

      // faccio una fetch request e capisco se l'utente con l'uid prelevato ha sessioni assegnate
      // se la risposta è vuota carico #noGame
      // altrimenti faccio vedere la tabella con tutti i giochi assegnati
      // tramite un bottone faccio poi decidere a quale gioco vuole giocare

      var url = root + "/games/" + objLoad.id; //URL a cui fare la fetch request sullo specifico utente
      fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
      })   .then((resp) => resp.json()) // Trasformo la risposta in formato json
           .then(function(data) {
             // controllo che via siano giochi assegnati ad uno specifico id
               if(!(data[0] === undefined)){

                  // se vi sono giochi assegnati, scorro l'array di risposta e vado a mettere i dati nella tabella
                  data.map(function(ex){

                    // creo la tabella
                    var button = '<button value="'+ ex.time_stamp + '" data-value ="'+ ex.number_img_assigned +'" type="button" class="btn-det btn btn-primary btn-lg button-game"><h1>Gioca</h1></button>';
                    var tr = "<tr><td><h1>" + ex.time_stamp + "</h1></td>" +
                             "<td><h1>" + ex.number_img_assigned + "</h1></td>" +
                             "<td>" + button + "<td></tr>";

                    $('#table tbody').append(tr);


                 });
                 // rendo visibile la tabella una volta creata
                 $("#tableContainer").show("slow");
               }
               // nel caso in cui un utente non abbia giochi assegnati carico la schemata con cui comunico che
               // non vi sono sessioni assegnate a quello specifico utente
               else {
                 $("#noGame").show("slow");
               }
            });
    }
    });

    // funzione utile per prelevare dai bottoni della tabella la giusta sessione
    // da caricare
    $('#tableContainer').on('click', 'button', function(){

        // prelevo il timestamp che mi permette di capire la giusta sessione
        objLoad.time_stamp = this.value;
        // prelevo il numero di immagini
        objNumber = this.getAttribute("data-value");
        // genero il vettore casuale di oggetti immagine
        arrayImg = generaOggetti(objNumber);

        // faccio sparire il container con la tabella e carico il bottone di inizio sessione
        $("#tableContainer").hide("slow");
        $("#loginGame").show("slow");

    });

    // bottone di inizio sessione, una volta cliccato lo nascondo e faccio partire la prima immagine
    // andando a popolare bottoni con le parole e caricando l'immagine dell'animale
    $("#big-button-start-session").click(function(){
        $("#loginGame").hide("slow", function() {

          // mixo i bottoni in modo che la parola esatta non capiti sempre sul primo
          var arrayMixButton = getMixWord(arrayImg[arrayCount]);

          $("#B1").changeValue(arrayMixButton[0]);
          $("#B2").changeValue(arrayMixButton[1]);
          $("#B3").changeValue(arrayMixButton[2]);
          $("#B4").changeValue(arrayMixButton[3]);
          $("#my-img").attr("src", arrayImg[arrayCount].img); // carico l'immagine
          $("#container-img").show("slow");
          $("#container-btt").show("slow");

          // prendo il tempo di inizio visualizzazione della foto
          arrayImg[arrayCount].time_start = getTimeNow();
          arrayCount++;

        });

        $("#B1").click(function() {
            // una volta che l'utente prende la decisione prelevo dal vettore con le immagini
            // la corretta parola, prelevo la scelta (prelevando il valore del bottone cliccato)
            // prendo il tempo di fine e lo passo ad una funzione che mi ritorna il numero di secondi
            // passati dal tempo rilevato all'inizio della visualizzazione e il temp rilevarto dopo la decisione
            objLoad.tag = arrayImg[arrayCount-1].tag;
            objLoad.scelta = document.getElementById("B1").value;
            objLoad.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());

            // faccio una fetch request, caricando l'oggetto creato di volta in volta
            // in modo che se l'utente per qualche motivo esce i dati rimangono salvati
            var url = root + "/games/" + objLoad.id;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(objLoad)
            })  .then((resp) => resp.json())
                .then(function(data){
                  // caso in cui dal server non ricevo una conferma di avvenuto caricamento
                  if(data.status!= 200){
                    $("#container-img").hide("slow");
                    $("#container-btt").hide("slow");
                    $("#problem").show("slow");
                  }
                });


            // controllo di non essere all'ultimo elemento di un array
            // se non è così procedo caricando l'immagine successiva e andando a modificare i bottoni
            // faccio partire il nuovo timer per l'immagine successiva
            if(arrayCount < objNumber){

              var arrayMixButton = getMixWord(arrayImg[arrayCount]);
              $("#B1").changeValue(arrayMixButton[0]);
              $("#B2").changeValue(arrayMixButton[1]);
              $("#B3").changeValue(arrayMixButton[2]);
              $("#B4").changeValue(arrayMixButton[3]);
              $("#my-img").attr("src", arrayImg[arrayCount].img)
              $("#container-img").show("slow");
              $("#container-btt").show("slow");
              arrayImg[arrayCount].time_start = getTimeNow();
              arrayCount++;

            }
            else{
              // caso in cui ho raggiunto il numero di elementi della Sessione
              // faccio sparire i container di immagini e bottoni e carico
              // quello con la scritta sessione terminata
              $("#container-img").hide("slow");
              $("#container-btt").hide("slow");
              $("#logout").show("slow");

            }

        });

        $("#B2").click(function() {

          objLoad.tag = arrayImg[arrayCount-1].tag;
          objLoad.scelta = document.getElementById("B2").value;
          objLoad.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());
          console.log(objLoad);

          var url = root + "/games/" + objLoad.id;

          fetch(url, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
              body: JSON.stringify(objLoad)
          })  .then((resp) => resp.json())
              .then(function(data){
                if(data.status!= 200){
                  $("#container-img").hide("slow");
                  $("#container-btt").hide("slow");
                  $("#problem").show("slow");
                }
              });

          if(arrayCount < objNumber){

            var arrayMixButton = getMixWord(arrayImg[arrayCount]);
            $("#B1").changeValue(arrayMixButton[0]);
            $("#B2").changeValue(arrayMixButton[1]);
            $("#B3").changeValue(arrayMixButton[2]);
            $("#B4").changeValue(arrayMixButton[3]);
            $("#my-img").attr("src", arrayImg[arrayCount].img)
            $("#container-img").show("slow");
            $("#container-btt").show("slow");
            arrayImg[arrayCount].time_start = getTimeNow();
            arrayCount++;

          }
          else{

            console.log(objLoad);
            $("#container-img").hide("slow");
            $("#container-btt").hide("slow");
            $("#logout").show("slow");
          }

        });

        $("#B3").click(function() {

          objLoad.tag = arrayImg[arrayCount-1].tag;
          objLoad.scelta = document.getElementById("B3").value;
          objLoad.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());
          console.log(objLoad);

          var url = root + "/games/" + objLoad.id;
          console.log(url)
          fetch(url, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
              body: JSON.stringify(objLoad)
          })  .then((resp) => resp.json())
              .then(function(data){
                if(data.status!= 200){
                  $("#container-img").hide("slow");
                  $("#container-btt").hide("slow");
                  $("#problem").show("slow");
                }
              });

          if(arrayCount < objNumber){

            var arrayMixButton = getMixWord(arrayImg[arrayCount]);
            $("#B1").changeValue(arrayMixButton[0]);
            $("#B2").changeValue(arrayMixButton[1]);
            $("#B3").changeValue(arrayMixButton[2]);
            $("#B4").changeValue(arrayMixButton[3]);
            $("#my-img").attr("src", arrayImg[arrayCount].img)
            $("#container-img").show("slow");
            $("#container-btt").show("slow");
            arrayImg[arrayCount].time_start = getTimeNow();
            arrayCount++;
          }
          else{

            //console.log(objLoad);
            $("#container-img").hide("slow");
            $("#container-btt").hide("slow");
            $("#logout").show("slow");
          }

        });

        $("#B4").click(function() {

          objLoad.tag = arrayImg[arrayCount-1].tag;
          objLoad.scelta = document.getElementById("B4").value;
          objLoad.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());
          console.log(objLoad);

          var url = root + "/games/" + objLoad.id;
          console.log(url)
          fetch(url, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
              body: JSON.stringify(objLoad)
          })  .then((resp) => resp.json())
              .then(function(data){
                if(data.status!= 200){
                  $("#container-img").hide("slow");
                  $("#container-btt").hide("slow");
                  $("#problem").show("slow");
                }
              });

          if(arrayCount < objNumber){
            var arrayMixButton = getMixWord(arrayImg[arrayCount]);
            $("#B1").changeValue(arrayMixButton[0]);
            $("#B2").changeValue(arrayMixButton[1]);
            $("#B3").changeValue(arrayMixButton[2]);
            $("#B4").changeValue(arrayMixButton[3]);
            $("#my-img").attr("src", arrayImg[arrayCount].img)
            $("#container-img").show("slow");
            $("#container-btt").show("slow");
            arrayImg[arrayCount].time_start = getTimeNow();
            arrayCount++;
          }
          else{

            $("#container-img").hide("slow");
            $("#container-btt").hide("slow");
            $("#logout").show("slow");

          }

        });

    });
});

// jQuery prototipo che mi permette di cambiare al volo il valore di bottoni e il loro testo
// che viene visualizzato dall'utente
$.fn.changeValue = function(v1) {
  $(this).val(v1);
  $(this).text(v1);

}
