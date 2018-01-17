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

//var ricorda[]; 

function firstImage(){
    //document.getElementByName("canvas").src = imagesArray[Math.random() * (imagesArray.length)];
    var r = Math.floor(Math.random() * (imagesArray.length));
    document.canvas.src = imagesArray[r];
}

//funzione che restituisce un'immagine
function displayImage(){
    //creo un numero random da 0 al numero di immagini
    var r = Math.floor(Math.random() * (imagesArray.length));
    //mostra l'immagine da imagesArray array nel canvas image 
    document.canvas.src = imagesArray[r];
}

/*function riempiArray(){
  do{
    var r = Math.floor(Math.random() * (imagesArray.length));
    ricorda.push(r);
    console.log(r);
  } 
  while (ricorda.includes(r)==false);
}*/