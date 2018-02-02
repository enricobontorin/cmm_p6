$(document).ready(function(){
  // root su cui andare a fare la richiesta fetch
  // var rootLoad = "http://localhost:8080/api/games";
  var rootLoad = "https://cmm-p6.herokuapp.com/api/games" //heroku url

  // quando viene cliccato il bottone di caricamento vengo presi i dati dai campi input
  // viene fatta una fetch request di tipo post per inserimento di una sessione e
  // nel caso vada tutto bene viene mostrato un alert verde
  $("#button-load").click(function(){

    // viene controllato che sia settato l'user name  altrimenti viene fatto il display di un alert
    // che  segnala la mancanza di questo campo e non fa procedere
    if(!(document.getElementById("uid_load").value)){
      $("#alert_noinput").show("slow").delay(2000).hide("slow");
      return;
    }
    else{
      var uid = document.getElementById("uid_load").value;
      var number_img_load = document.getElementById("number_img_load").value;
      var body = {"uid" : uid, "number_img_assigned" : number_img_load};

      // viene fatta la richiesta all'API, con un body contenete numero di immagini e uid
      fetch(rootLoad, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(body)
      });
      $("#uid_load").val("");
      $("#number_img_load").val(1);
      $("#alert_okload").show("slow").delay(2000).hide("slow");
    }
  });
});
