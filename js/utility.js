$(document).ready(function(){
    $("#big-button-start-session").click(function(){
        $("#login").hide("slow", function() {
            $("#B1").changeValue("Gatto");
            $("#B2").changeValue("Papera");
            $("#B3").changeValue("Toro");
            $("#B4").changeValue("Volpe");
            $("#my-img").attr("src", "img/gatto.jpg")
            $("#container-img").show("slow");
            $("#container-btt").show("slow");
        });

        $("#B1").click(function() {
            $("#B1").changeValue("Toro");
            $("#B2").changeValue("Leone");
            $("#B3").changeValue("Volpe");
            $("#B4").changeValue("Gatto");
            $("#my-img").attr("src", "img/leone.jpg")
        });

        $("#B2").click(function() {
            $("#B1").changeValue("Cane");
            $("#B2").changeValue("Topo");
            $("#B3").changeValue("Volpe");
            $("#B4").changeValue("Canarino");
            $("#my-img").attr("src", "img/cane.jpg")
        });

        $("#B3").click(function() {
            $("#B1").changeValue("Papera");
            $("#B2").changeValue("Toro");
            $("#B3").changeValue("Volpe");
            $("#B4").changeValue("Cervo");
            $("#my-img").attr("src", "img/papera.jpg")
        });

        $("#B4").click(function() {
            $("#B1").changeValue("Canguro");
            $("#B2").changeValue("Topo");
            $("#B3").changeValue("Panda");
            $("#B4").changeValue("Gatto");
            $("#my-img").attr("src", "img/panda.jpg")
        });

    });
});


$.fn.changeValue = function(v1) {
  $(this).val(v1);
  $(this).text(v1);

}
