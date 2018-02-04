// globals require, console, process
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var GameSession = require('./session');
var js2xmlparser = require("js2xmlparser");
var xml = false;
var fs = require('fs');
var CreateObj = require('./public/javascript/createObj.js');
var CountFileImg = require('./public/javascript/countFile.js');
var imgFolder = './public/images/';

// viene inizializzato un'instanza di mongoose e la relativa connessione al db di mLab
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://cmm_p6:cmm_p6@ds263137.mlab.com:63137/cmm_p6'/*, options*/);
const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});

// viene inizializzato express che mi permetterà di andare a lavorare con le rotte
const app = express();

// viene configurato il bodyParser()
// utile quando si ricevono richieste di tipo POST & PUT
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// viene settata la porta su cui trovare la mia applicazione
var port = process.env.PORT || 8080;

// vengono incluse le sottodirectory e lo porto tutte a livello principale
// utile per non avere path chilometrici
app.use(express.static('public'))
app.use(express.static('views'))

// viene lanciato il gioco caricando index.html
app.get('/', (req, res) => {
  // res.writeHead(200, {'Content-Type': 'text/plain'});
  res.redirect('index.html')
});

// vengoono definite le API
var router = express.Router();

router.route('/vector/:number_img')
  // accessibile tramite GET request -> http://localhost:8080/api/vector/:number_img)
  // utilizzata per scopi interni
  // ritorna un json del vettore di immagini di gioco prelevate dalla cartella delle immagini
  // in maniera randomica e inoltre tramite generaOggetti vengono anche associate altre
  // parole diverse da quella corretta per poi somminstrarle in un secondo momento all'utilizzatore
  .get(function (req, res) {
      var number_img = req.params.number_img;
      var imagesArray = [];
      var nameImg;
      fs.readdirSync(imgFolder).forEach(file => {
        nameImg = String(file);
        nameImg = nameImg.slice(0, -4);
        imagesArray.push(nameImg);
      })
      res.status(200);
      res.json(CreateObj(number_img, imagesArray));

      });

// rotta utile per il caricamento dei giochi, il caricamento dei risultati della sessione e per ottenere
// i dati relativi al singolo utente sulle sessioni che non ha ancora fatto
router.route('/games')
// accessibilie in locale tramite POST request -> http://localhost:8080/api/games
// accessibilie in  remoto tramite POST request -> https://cmm-p6.herokuapp.com/api/games
// permette di andare a caricare ed assegnare una sessione per un determianto paziente
// si aspetta con body parameters uid (user id) e il numero di immagini assegnate
// calcola automaticamente il giorno e l'ora dell'assegnamento
  .post(function (req, res) {

      // controllo vi sia un username valido altrimenti viene ritornato
      // un messaggio che lo notifica
      if(req.body.uid != null && req.body.uid != ""){
        // viene creato un timeStamp della richiesta
        var data = new Date();
        var hours, min, sec, day, month, year, full;
        year = data.getFullYear();
        month = data.getMonth() + 1; //js conta i mesi da 0 a 11
        day = data.getDate();
        hours = data.getHours();
        min = data.getMinutes();
        sec = data.getSeconds();
        if (sec < 10) sec = "0" + sec;
        if (min < 10) min = "0" + min;
        if (hours < 10) hours = "0" + hours;
        if (day < 10) day = "0" + day;
        if (month < 10) month = "0" + month;
        full = year + "/" + month + "/" + day + "-" + hours + ":" + min + ":" + sec;

        // viene creata una nuova instanza di tipo GameSession, che è la forma del documento che ho definito
        // per poi salvare i dati nel db, e vado ad assegnare i parametri ricevuti e quelli con valore di default
        var gameSession = new GameSession();


        // il conto dei file all'interno della cartella delle immagini viene fatto utilizzando
        // il meccanismo delle promise, che è molto utilizzato in js, in quanto essendo a sincrono
        // altrimenti, come in questo caso, quando di mezzo ci sono letture su file nelle directory,
        // il motore js va avanti a fare dell'altro e quindi il numero delle immagini arriva solamente dopo la sua valutazione
        // in questo modo si blocca tutto il sistema fino a che la funzione che fa il calcolo del numero di file in una
        // cartella non finisce il suo lavoro e poi, dopo il then, riparte tutto andando a settare i parametri corretti
        // e caricando la sessione nel db
        CountFileImg(imgFolder).then(function(number_img_folder){
          // viene controllato che il numero di immagini per la sessione sia maggiore o uguale a uno
          // e minore o uguale del numero di immagini presenti nella cartella delle immagini di gioco
          // viene controllato che sia un intero altrimenti tolgo la parte dopo la virgola
          // vienen controllato  che non sia null, in tutti i casi in cui sia minore del minimo
          // null o maggiore del massimo viene impostato il valore nel limite
          //caso in cui non sia un numero
          if(isNaN(req.body.number_img_assigned)) gameSession.number_img_assigned = 1;
          //caso in cui sia un numero, lo parso a intero e poi faccio le valutazioni
          else {
            var n_img_input = parseInt(Math.round(parseFloat(req.body.number_img_assigned)));
            if(req.body.number_img_assigned >= 1 && n_img_input <= number_img_folder && number_img_folder > 0)
              gameSession.number_img_assigned = n_img_input;
            else if (req.body.number_img_assigned < 1)
              gameSession.number_img_assigned = 1;
            else if (n_img_input > number_img_folder && number_img_folder > 0 )
              gameSession.number_img_assigned = number_img_folder;
            else
              gameSession.number_img_assigned = 1;
          }

          //vengono settati tutti gli altri parametri
          gameSession.uid = req.body.uid;
          gameSession.time_stamp = full;
          gameSession.play = false;
          gameSession.number_error = 0;
          gameSession.number_img_done = 0;
          gameSession.time_total = 0;
          gameSession.img = [];


          // viene salvata la nuova sessione e controllo che sia stata creata correttamente
          gameSession.save(function (err, sessCreated) {
              if (err) { res.status(500).send(err); }
              res.status(200);
              res.json(sessCreated);
          });

        })
      }
      else {
        res.status(200);
        res.json({ message: "Inserire nome utente" });
      }
  })
  // accessibile in locale tramite DELETE request -> http://localhost:8080/api/games
  // accessibile in remoto tramite DELETE request -> https://cmm-p6.herokuapp.com/api/games
  // API che permette di eliminare una specifica sessione di gioco di uno specifico utente
  .delete(function (req, res) {
      if((req.body.uid) && (req.body.time_stamp)){
        query = {uid: req.body.uid, time_stamp: req.body.time_stamp };
        console.log(query);
          GameSession.remove(query, function (err, gameSession) {
             if (err) { res.send(err); }
             if (!GameSession) res.json({ message: "Sessione eliminata" });
             else {
               res.status(404);
               res.json({ message: "Nessuna sessione da eliminare" });
             }
          });
      }
      else {
        res.json({ message: "Settare i parametri correttamente" });
      }
  });

  router.route('/games/:uid')
    // accessibile in locale tramite GET request -> http://localhost:8080/api/games/:uid
    // accessibile in remoto tramite GET request -> https://cmm-p6.herokuapp.com/api/games/:uid
    // mi permette di ottenere le sessioni ancora non giocate da uno specifico uid
    // utilizzata per scopi interni. Per quanto riguarda l'esterno è stata predisposta un'altra API apposita
    .get(function (req, res) {
        //si ricerca nel db le sessioni assegnate a un particolare uid ancora non giocate
        GameSession.find({uid: req.params.uid, play: false}, function (err, gameSession) {
            if (err) { res.status(500).send(err)}
            if (gameSession) {
                  // nel caso in cui non vi siano errori di connessione al server err500
                  // vengono ritornate tutte le sessioni non ancora giocare di uno specifico uid
                  res.status(200);
                  res.json(gameSession);
            }
        });
    })

   // accessibile tramite in locale PUT request -> http://localhost:8080/api/games/:uid
   // accessibile tramite in remoto PUT request -> https://cmm-p6.herokuapp.com/api/games/:uid
   .put(function (req, res) {
       // ogni volta che viene fatta una pull request, oltre all'id la query viene filtrata anche per
       // il time_stamp in modo che si riesca ad andare ad aggiornare la giusta sessione di gioco
       GameSession.find({uid: req.params.uid, time_stamp: req.body.time_stamp}, function (err, gameSession){
           if (err) { res.send(err); }
           if(!GameSession){
             // vengo aggiornati i vari campi, viene inoltre controllata la parola scelta se
             // corrisponde alla parola giusta, in caso negativo viene incrementato il numero di errori
             if(req.body.picked_word != req.body.tag) gameSession[0].number_error++;
             gameSession[0].time_total += req.body.time_word;
             gameSession[0].play = true;

             // viene creato l'oggetto immagine per poi inserirlo e tenere traccia di
             // ogni singola immagine proposta, parola scelta  e relativo tempo
             var obj = '{ "tag": "' + req.body.tag + '", "scelta": "' + req.body.picked_word + '", "time_word": "' + req.body.time_word + 's"}';
             gameSession[0].img.push(JSON.parse(obj));
             gameSession[0].number_img_done++;

             // viene salvata la sessione modificata nel database
             gameSession[0].save(function (err) {
                 if (err) { res.send(err); }
                 res.json({ status: 200 });
             });
           }
           else {
             res.status(404);
             res.json({ message: 'Utente non trovato' });
           }
       });
   })

   router.route('/results')

     // accessibile in locale tramite GET request -> http://localhost:8080/api/results
     // accessibile in remoto tramite GET request -> http://cmm-p6.herokuapp.com/api/results )
     // API che rende disponibili i risultati delle sessioni
     .get(function (req, res) {

       //viene composta la query andando a filtrare i vari url e capendo che dati preferisce ricevere chi fa la richiests
       var query;

       // esempio http://localhost:8080/api/result?uid=pino&play=false
       if((req.query.uid) && (req.query.play)) query = {uid: req.query.uid, play: req.query.play };
       // esempio http://localhost:8080/api/result?uid=pino
       else if((req.query.uid) && !(req.query.play)) query = {uid: req.query.uid};
       // esempio http://localhost:8080/api/result?play=false
       else if(!(req.query.uid) && (req.query.play)) query = {play: req.query.play };
       // nel caso in cui non venisse fornito nessun filtraggio vengono ritornati tutti i risultati
       else query = {};

       // viene eseguita la query al DB
       GameSession.find(query , function (err, gameSession) {
           if (err) { res.status(500).send(err) }
           if (gameSession) {
                  var objToReturn = [];

                  // viene ciclato tutto l'array risultante dalla query
                  // i dati vengono organizzati in un formato facilmente leggibile a colpo d'occhio
                  gameSession.map(function(game){
                    var objTmp = {};
                    objTmp.uid = game.uid;
                    objTmp.time_stamp = game.time_stamp;
                    objTmp.img_done = game.number_img_done + "/" + game.number_img_assigned;
                    objTmp.error = game.number_error + "/" + game.number_img_done;
                    objTmp.time_session = game.time_total + "s";
                    objTmp.img = game.img;
                    console.log(objTmp);
                    objToReturn.push(objTmp);
                  });

                 res.status(200);

                 if(xml != true) res.json(objToReturn);
                 else {res.send(js2xmlparser.parse("session", objToReturn));}

           }
         });
     });

// viene abilitato il middleware route affinche supporti CORS e le richieste preflighted
// abilitando CORS il mio server può ricevere richieste da altri domini, altrimenti non sarebbe abilitato
app.use(function (req, res, next) {
    // viene stampato in console del server che ho ricevuto una richiesta
    console.log('Received request.');

    // viene abilitato il CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.accepts('json') || req.accepts('text/html')) {
            res.header('Content-Type', 'application/json');
            xml = false;
    }
    else if (req.accepts('application/xml')) {
            res.header('Content-Type', 'text/xml');
            xml = true;
    }

    // res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST ,DELETE');
        return res.status(200).json({});
    }
    // vengono indirizzate le richieste alla rotta successiva
    next();
});


// vengono registrate tutte le nostre rotte prima definite sotto /api
app.use('/api', router);

// vengono catturate le richieste non valide
app.use((req, res, next) => {
    const err = new Error('Non trovato');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

// viene avviato il servizio sulla giusta porta
app.listen(port);
console.log('Server on, port: ' + port);
