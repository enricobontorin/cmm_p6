$(document).ready(function(){
    // variabile che contiene il numero di immagini da caricare per la sessione di gioco corrente
    var objNumber;
    // variabile che contiene l'array di oggetti immagine generati casualmente di length objnumber
    var arrayImg = [];
    // contatore del numero di immagini giocate
    var arrayCount = 0;

    // oggetto che poi verrà passato nel campo della richiesta api per caricare
    // la singola immagine giocata, esito e tempo impiegato nel decidere la parola associata
    var objLoad = {
      id : "",
      tag: "",
      time_stamp: "",
      picked_word: "",
      time_word: ""
    };

    // root su cui viene fatta la richiesta fetch
    //var root = "http://localhost:8080/api";
    var root = "https://cmm-p6.herokuapp.com/api" //heroku url

    // quando viene cliccato il bottone che si presenta nella schemata di login
    // viene prelevato l'user name e viene fatta una richiesta ad una nostra API
    // che ritorna le sessioni di gioco che sono state assegnate allo specifico utente
    // inserito nell'username
    $("#big-button-start").click(function(){
      if(!($("#usr").val())){
        $("#alertNoUsr").show("slow");
        return;
      }
      else{
      // viene prelevato username
      var val = $("#usr").val();
      objLoad.id = val.toLowerCase();
      //viene nascosto il frame di login
      $("#login").hide("slow");

      // viene fatta una fetch request in modo da capire  se l'utente con l'uid prelevato ha sessioni assegnate
      // se la risposta è vuota carico #noGame
      // altrimenti viene fatta vedere la tabella con tutti i giochi assegnati
      // tramite un bottone viene data la possibilità all'utente di decidere a quale gioco vuole giocare

      var url = root + "/games/" + objLoad.id; //URL a cui viene fatta la fetch request sullo specifico utente
      fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
      })   .then((resp) => resp.json()) // viene trasformata la risposta in formato json
           .then(function(data) {
             // viene controllato che vi siano giochi assegnati ad uno specifico id
               if(!(data[0] === undefined)){

                  // se vi sono giochi assegnati, viene scorso l'array di risposta e vengono messi i dati nella tabella
                  data.map(function(ex){

                    // viene creata la tabella
                    var button = '<button value="'+ ex.time_stamp + '" data-value ="'+ ex.number_img_assigned +'" type="button" class="btn-det btn btn-primary btn-lg button-game"><h1>Gioca</h1></button>';
                    var tr = "<tr><td><h1>" + ex.time_stamp + "</h1></td>" +
                             "<td><h1>" + ex.number_img_assigned + "</h1></td>" +
                             "<td>" + button + "<td></tr>";

                    $('#table tbody').append(tr);


                 });
                 // viene resa visibile la tabella una volta creata
                 $("#tableContainer").show("slow");
               }
               // nel caso in cui un utente non abbia giochi assegnati viene caricata la schemata con cui
               //viene comunicato che non vi sono sessioni assegnate a quello specifico utente
               else {
                 $("#noGame").show("slow");
               }
            });
    }
    });

    // funzione utile per prelevare dai bottoni della tabella la giusta sessione
    // da caricare
    $('#tableContainer').on('click', 'button', function(){

        // viene prelevato il timestamp che mi permette di capire la giusta sessione
        objLoad.time_stamp = this.value;
        // viene prelevato il numero di immagini
        objNumber = this.getAttribute("data-value");

        // fetch request ad un'apposita API nel server che ritorna
        // un vettore di oggetti di gioco contentente immagini e parole
        // che verranno mostrate all'utente.
        var url = root + "/vector/" + objNumber;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }})
             .then((resp) => resp.json()) // viene trasformata la risposta in formato json
             .then(function(data) {
               // viene parsata la risposta in modo da passare da una risposta in formato JSON
               // ad un array contente oggetti del tipo
               // obj { img, tag, parola1, parola2, parola3, time_start
                for(var i = 0; i < data.length; i++){
                  var objTmp = {};
                  console.log(data[i].img);
                  objTmp.img = data[i].img;
                  objTmp.tag = data[i].tag;
                  objTmp.word1 = data[i].word1;
                  objTmp.word2 = data[i].word2;
                  objTmp.word3 = data[i].word3;
                  objTmp.time_start = data[i].time_start;

                  // inserimento dell'oggetto nell'array di immagini di gioco
                  arrayImg.push(objTmp);
                }

                // viene nascosto il container con la tabella e caricato il bottone di inizio sessione
                $("#tableContainer").hide("slow");
                $("#loginGame").show("slow");
              })

    });

    // bottone di inizio sessione, una volta che viene cliccato viene nascondo e viene fatta partire la prima immagine
    // popolando bottoni con le parole e caricando l'immagine dell'animale
    $("#big-button-start-session").click(function(){
        $("#loginGame").hide("slow", function() {

          // vengono mixati i bottoni in modo che la parola esatta non capiti sempre sul primo bottone
          var arrayMixButton = getMixWord(arrayImg[arrayCount]);

          $("#B1").changeValue(arrayMixButton[0]);
          $("#B2").changeValue(arrayMixButton[1]);
          $("#B3").changeValue(arrayMixButton[2]);
          $("#B4").changeValue(arrayMixButton[3]);
          $("#my-img").attr("src", arrayImg[arrayCount].img); // viene caricata l'immagine
          $("#container-img").show("slow");
          $("#container-btt").show("slow");

          // viene preso il tempo di inizio visualizzazione della foto
          arrayImg[arrayCount].time_start = getTimeNow();
          arrayCount++;

        });

        $("#B1").click(function() {
            // una volta che l'utente prende la decisione viene prelevato dal vettore con le immagini
            // la corretta parola, viene prelevata la scelta (prelevando il valore del bottone cliccato)
            // viene preso  il tempo di fine e viene passato ad una funzione che mi ritorna il numero di secondi
            // passati dal tempo rilevato all'inizio della visualizzazione e il temp rilevarto dopo la decisione
            objLoad.tag = arrayImg[arrayCount-1].tag;
            objLoad.picked_word = $("#B1").val();
            objLoad.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());

            // viene fatta una fetch request, caricando l'oggetto creato di volta in volta
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
                  // caso in cui dal server non si riceva una conferma di avvenuto caricamento
                  if(data.status!= 200){
                    $("#container-img").hide("slow");
                    $("#container-btt").hide("slow");
                    $("#problem").show("slow");
                  }
                });


            // viene controllato di non essere all'ultimo elemento di un array
            // se non è così viene caricata l'immagine successiva andando a modificare i bottoni
            // viene fatto partire il nuovo timer per l'immagine successiva
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
              // caso in cui viene raggiunto il numero di elementi della Sessione
              // viene nascosto i container di immagini e bottoni e viene caricato
              // quello con la scritta sessione terminata
              $("#container-img").hide("slow");
              $("#container-btt").hide("slow");
              $("#logout").show("slow");

            }

        });

        $("#B2").click(function() {

          objLoad.tag = arrayImg[arrayCount-1].tag;
          objLoad.picked_word = $("#B2").val();
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
          objLoad.picked_word = $("#B3").val();
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
          objLoad.picked_word = $("#B4").val();
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

// jQuery prototipo che permetto di cambiare al volo il valore di bottoni e il loro testo
// che viene visualizzato dall'utente
$.fn.changeValue = function(v1) {
  $(this).val(v1);
  $(this).text(v1);

}
