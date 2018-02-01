$(document).ready(function(){


  $("#button-result").click(function(){
    // root su cui andare a fare la richiesta fetch
    //var rootLoad = "http://localhost:8080/api/results";
    var rootLoad = "https://cmm-p6.herokuapp.com/api/results" //heroku url

    var uid = "";
    var play = "";
    var application = "application/json";


    // prelevo i campi di filtraggio
    if($("#uid_result").val()) uid = $("#uid_result").val();
    if($("#play_result").val()) play = $("#play_result").val();
    if($("#format_result").val() != "json" ) application = "application/xml";

    // compongo la query
    if((uid != "") && (play != ""))
        rootLoad += "?uid=" + uid + "&play=" + play;
    else if((uid != "") && (play == ""))
        rootLoad += "?uid=" + uid;
    else if((uid == "") && (play != ""))
        rootLoad += "?play=" + play;

    // eseguo la fetch request
    fetch(rootLoad, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': application
        },
    })
      // se il formato richiesto è json converto in json il risultato
      // altrimenti faccio un text con l'XML
      .then((resp) =>{if(application == "application/json") return resp.json()
                       else return resp.text()})
      .then(function(data) {
        // caso json
        if(application == "application/json"){
          // svuoto la textarea
          $("#results").replaceWith('<div id="results" style="margin-top: 30px"><textarea disabled id="resultArea" rows="40" cols="80" style="border:none;"></textarea></div>')

          // scorro tutta la risposta in json e aggiungo alla text area tutte le sessioni json
          // che la query ha ritornato
          data.map(function(element){
            $("#resultArea").append(JSON.stringify(element, null, 4) + "\n");
          });
        }

        // caso xml
        else if(application == "application/xml"){
          // svuoto la textarea
          $("#results").replaceWith('<div id="results" style="margin-top: 30px"><textarea disabled id="resultArea" rows="40" cols="80" style="border:none;"></textarea></div>')

          // viene aggiunto \n dove necessario
          //  - aggiunto \n tra le parentesi angolate dove non c'è contenuto
          //  - rimosso \n tra tag di apertura e chiusura dello stesso nodo se non c'è niente al loro interno
          //  - aggiunto \n tra una serie di parentesi angolate e la serie successiva
          //  - diviso in array
          xmlString = data.trim() // rimuovo spazi a inizio e fine stringa
              .replace(/>\s*</g,'>\n<')
              .replace(/(<[^\/>].*>)\n(<[\/])/g,'$1$2')
              .replace(/(<\/[^>]+>|<[^>]+\/>)(<[^>]+>)/g,'$1\n$2');
          xmlArr = xmlString.split('\n');

          // indento in maniera corretta ogni linea
          var tabs = '';          // indentazione iniziale
          var start = 0;          // linea iniziale
          //if (/^<[?]xml/.test(xmlArr[0])) start++;    // da usare nel caso la prima linea non sia l'header

          //scorro tutte le linee
          for (var i = start; i < xmlArr.length; i++) {
              var line = xmlArr[i].trim();    //rimuovo eventuali spazi
              if (/^<[/]/.test(line)) {
                  // se la linea è un tag di chiusura
                  // viene rimosso un tab dall'indentazione corrente
                  // vengono aggiunti i tab all'inizio di ogni riga
                  tabs = tabs.replace(/.$/, '');
                  xmlArr[i] = tabs + line;
              } else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(line)) {
                  // se la linea contiene un nodo intero
                  // vengono aggiunti i tab all'inizio della riga
                  xmlArr[i] = tabs + line;
              } else {
                  // se la linea comincia con un tag di apertura e non contiene una nodo intero
                  // vengono aggiunti i tab all'inizio della riga
                  // e viene aggiunto un tab all'indentazione corrente
                  xmlArr[i] = tabs + line;
                  tabs += '\t';
              }
          }

          // ritrasformo l'array in stringa e lo stampo
          var r = xmlArr.join('\n');
          // aggiungo il testo alla textarea per renderlo visibile
          $("#resultArea").text(r);
        }
      })
  });//btt
});//form
