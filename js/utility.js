$(document).ready(function(){
    var objNumber = 5;
    var arrayImg = generaOggetti(objNumber);
    var arrayCount = 0;

    var objFinal = {
      id : "",
      number_word : 0,
      number_error : 0,
      arrayResult : [],
      time_total : 0
    };



    $("#big-button-start-session").click(function(){
        $("#login").hide("slow", function() {
          var arrayMixButton = getMixWord(arrayImg[arrayCount]);

          objFinal.id = document.getElementById("usr").value;
          objFinal.number_error = 0;

          $("#B1").changeValue(arrayMixButton[0]);
          $("#B2").changeValue(arrayMixButton[1]);
          $("#B3").changeValue(arrayMixButton[2]);
          $("#B4").changeValue(arrayMixButton[3]);
          $("#my-img").attr("src", arrayImg[arrayCount].img)
          $("#container-img").show("slow");
          $("#container-btt").show("slow");

          arrayImg[arrayCount].time_start = getTimeNow();
          arrayCount++;

        });

        $("#B1").click(function() {
            //fare tutti le operazioni del caso
            //setto il tempo di end dell'elemento passato
            //arrayImg[arrayCount-1].time_end = getTimeNow();
            //prendo il valore del bottone
            //arrayImg[arrayCount-1].parola_scelta = document.getElementById("B1").value;

            //devo calcolare il tempo di end. chiamare time diff e mettere scelta, tag
            //time sull'oggetto objToPush e fare un push su arrayResult
            var objToPush ={};
            objToPush.tag = arrayImg[arrayCount-1].tag;
            objToPush.scelta = document.getElementById("B1").value;
            objToPush.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());
            objFinal.number_word = arrayCount; //da rivedere
            objFinal.arrayResult.push(objToPush);
            if(objToPush.scelta != objToPush.tag) objFinal.number_error ++;
            objFinal.time_total += objToPush.time_word;

            //controllo di non essere all'ultimo elemento di un array, se non lo sono
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

              console.log(objFinal);
              $("#container-img").hide("slow");
              $("#container-btt").hide("slow");
              $("#logout").show("slow");

            }

        });

        $("#B2").click(function() {
          var objToPush ={};
          //devo calcolare il tempo di end. chiamare time diff e mettere scelta, tag
          //time sull'oggetto objToPush e fare un push su arrayResult
          objToPush.tag = arrayImg[arrayCount-1].tag;
          objToPush.scelta = document.getElementById("B2").value;
          objToPush.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());
          objFinal.number_word = arrayCount; //da rivedere
          objFinal.arrayResult.push(objToPush);
          if(objToPush.scelta != objToPush.tag) objFinal.number_error ++;
          objFinal.time_total += objToPush.time_word;

          //controllo di non essere all'ultimo elemento di un array, se non lo sono
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

            console.log(objFinal);
            $("#container-img").hide("slow");
            $("#container-btt").hide("slow");
            $("#logout").show("slow");
          }

        });

        $("#B3").click(function() {
          var objToPush ={};
          //devo calcolare il tempo di end. chiamare time diff e mettere scelta, tag
          //time sull'oggetto objToPush e fare un push su arrayResult
          objToPush.tag = arrayImg[arrayCount-1].tag;
          objToPush.scelta = document.getElementById("B3").value;
          objToPush.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());
          objFinal.number_word = arrayCount; //da rivedere
          objFinal.arrayResult.push(objToPush);
          if(objToPush.scelta != objToPush.tag) objFinal.number_error ++;
          objFinal.time_total += objToPush.time_word;

          //controllo di non essere all'ultimo elemento di un array, se non lo sono
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

            console.log(objFinal);
            $("#container-img").hide("slow");
            $("#container-btt").hide("slow");
            $("#logout").show("slow");
          }

        });

        $("#B4").click(function() {
          var objToPush ={};
          //devo calcolare il tempo di end. chiamare time diff e mettere scelta, tag
          //time sull'oggetto objToPush e fare un push su arrayResult
          objToPush.tag = arrayImg[arrayCount-1].tag;
          objToPush.scelta = document.getElementById("B4").value;
          objToPush.time_word = diffTime(arrayImg[arrayCount-1].time_start, getTimeNow());
          objFinal.number_word = arrayCount; //da rivedereù
          objFinal.arrayResult.push(objToPush);
          if(objToPush.scelta != objToPush.tag) objFinal.number_error ++;
          objFinal.time_total += objToPush.time_word;

          //controllo di non essere all'ultimo elemento di un array, se non lo sono
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

            console.log(objFinal);
            $("#container-img").hide("slow");
            $("#container-btt").hide("slow");
            $("#logout").show("slow");
             
          }

        });

    });
});


$.fn.changeValue = function(v1) {
  $(this).val(v1);
  $(this).text(v1);

}
