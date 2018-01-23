// globals require, console, process
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var GameSession = require('./session');
var js2xmlparser = require("js2xmlparser");
var xml = false;

// inizializzo un'instanza di mongoose e la relativa connessione al db di mLab
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://cmm_p6:cmm_p6@ds263137.mlab.com:63137/cmm_p6'/*, options*/);
const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});

// inializzo express che mi permetterà di andare a lavorare con le rotte
const app = express();

// configuro il bodyParser()
// utile quando si ricevono richieste di tipo POST & PUT
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setto la porta su cui trovare la mia applicazione
var port = process.env.PORT || 8080;

// includo le sottodirectory e lo porto tutte a livello principale
// utile soprattutto per non avere path chilometrici
app.use(express.static('public'))
app.use(express.static('views'))

// lancio il gioco caricando index.html
app.get('/', (req, res) => {
  // res.writeHead(200, {'Content-Type': 'text/plain'});
  res.redirect('index.html')
});

// definisco le mie API
var router = express.Router();

// rotta utile per il caricamento dei giochi, il caricamento dei risultati della sessione e per ottenere
// i dati relativi al singolo utente sulle sessioni che non ha ancora fatto
router.route('/games')
// accessibilie tramite POST request -> http://localhost:8080/api/gameSession
// permette di andare a caricare ed assegnare una sessione per un determianto paziente
// si aspetta con body parameters uid (user id) e il numero di immagini assegnate
// calcola automaticamente il giorno e l'ora dell'assegnamento
  .post(function (req, res) {

      //creo timeStamp richiesta
      var data = new Date();
      var ore, min, sec, giorno, mese, anno, full;
      anno = data.getFullYear();
      mese = data.getMonth() + 1; //js conta i mesi da 0 a 11
      giorno = data.getDate();
      ore = data.getHours();
      min = data.getMinutes();
      sec = data.getSeconds();
      if (sec < 10) sec = "0" + sec;
      if (min < 10) min = "0" + min;
      if (ore < 10) ore = "0" + ore;
      if (giorno < 10) giorno = "0" + giorno;
      if (mese < 10) mese = "0" + mese;
      full = anno + "/" + mese + "/" + giorno + "-" + ore + ":" + min + ":" + sec;



      // creo una nuova instanza di tipo GameSession, che è la forma del documento che ho definito
      // per poi salvare i dati nel db, e vado ad assegnare i parametri ricevuti e quelli con valore di default
      var gameSession = new GameSession();

      gameSession.uid = req.body.uid;
      gameSession.number_img_assigned = req.body.number_img_assigned;
      gameSession.time_stamp = full;
      gameSession.play = false;
      gameSession.number_error = 0;
      gameSession.number_img_done = 0;
      gameSession.time_total = 0;
      gameSession.img = [];

      // salvo la nuova sessione e controllo che sia stata creata correttamente
      gameSession.save(function (err, sessCreated) {
          if (err) { res.status(500).send(err); }
          res.status(200);
          res.json(sessCreated);
      });
  })
  // accessibile tramite DELETE request -> http://localhost:8080/api/gameSession)
  // API che permette di eliminare una specifica sessione di gioco di uno specifico utente
  .delete(function (req, res) {
      if((req.body.uid) && (req.body.time_stamp)){
        query = {uid: req.body.uid, time_stamp: req.body.time_stamp };
        console.log(query);
          GameSession.remove(query, function (err, gameSession) {
             if (err) { res.send(err); }
             res.json({ message: "Sessione Eliminata" });
          });
      }
      else {
        res.json({ message: "Settare i parametri correttamente" });
      }
  });


  router.route('/games/:uid')
    // accessibile tramite GET request -> http://localhost:8080/api/games/:uid)
    // mi permette di ottenere le sessioni ancora non giocate da uno specifico uid
    // utilizzata per scopi interni. Per quanto riguarda l'esterno è stata predisposta un'altra API apposita
    .get(function (req, res) {
        //cerco nel db le sessioni assegnate a un particolare uid ancora non giocate
        GameSession.find({uid: req.params.uid, play: false}, function (err, gameSession) {
            if (err) {
              console.log("err");
                        res.status(500).send(err)
                    }
            if (gameSession) {
                  // nel caso in cui non vi siano errori di connessione al server err500
                  // ritorno tutte le sessioni non ancora giocare di uno specifico uid
                  res.status(200);
                  res.json(gameSession);
            }
            /*
            //da vedere se toglierlo o meno
            else {  //caro in cui non via siano sessioni a                 res.status(404);
                res.json({ message: 'nogame' });

            }*/

        });
    })

   // accessibile tramite PUT request -> http://localhost:8080/api/games/:uid)
   .put(function (req, res) {
       // ogni volta che viene fatta una pull request, oltre all'id la query viene filtrata anche per
       // il time_stamp in modo che si riesca ad andare ad aggiornare la giusta sessione di gioco
       GameSession.find({uid: req.params.uid, time_stamp: req.body.time_stamp}, function (err, gameSession){
           if (err) { res.send(err); }

           // vengo aggiornati i vari campi, viene inoltre controllata la parola scelta se
           // corrisponde alla parola giusta, in caso negativo viene incrementato il numero di errori
           if(req.body.scelta != req.body.tag) gameSession[0].number_error++;
           gameSession[0].time_total += req.body.time_word;
           gameSession[0].play = true;

           // creo l'oggetto immagine per poi inserirlo e tenere traccia di
           // ogni singola immagine proposta, parola scelta  e relativo tempo
           var obj = '{ "tag": "' + req.body.tag + '", "scelta": "' + req.body.scelta + '", "time_word": "' + req.body.time_word + 's"}';
           gameSession[0].img.push(JSON.parse(obj));
           gameSession[0].number_img_done++;

           // salvo la sessione modificata nel database
           gameSession[0].save(function (err) {
               if (err) { res.send(err); }
               res.json({ status: 200 });
           });

       });
   })

   router.route('/results')

     // accessibile tramite GET request -> http://localhost:8080/api/result)
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
           if (err) {
             console.log("err");
                       res.status(500).send(err)
                   }
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
           /*else {  // In case no assignment was found with the given query
               res.status(404);
               res.json({ message: 'nogame' });
           }*/

         });
     });

// middleware route to support CORS and preflighted requests
// abilito il middleware route affinche supporti CORS e le richieste preflighted
// abilitando CORS il mio server può ricevere richieste da altri domini, altrimenti non sarebbe abilitato
app.use(function (req, res, next) {
    // stampo in console del server che ho ricevuto una richiesta
    console.log('Ricevuto richiesta.');

    //abilito CORS
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

    //res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST ,DELETE');
        return res.status(200).json({});
    }
    // indirizziamo le richieste alla rotta successiva
    next();
});


// registriamo tutte le nostre rotte prima definite sotto /api
app.use('/api', router);

// catturo le richieste non valide
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

// avvio il servizio sulla giusta porta
app.listen(port);
console.log('Avviato servizio sulla porta ' + port);
