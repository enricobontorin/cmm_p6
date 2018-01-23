/*globals require, module */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSession = new Schema({
   uid : String,
   time_stamp : String,
   number_img_assigned : Number,
   number_img_done : Number,
   number_error : Number,
   time_total : Number,
   play : Boolean,
   img : [{}]

     // definisco un vettore di oggetti per img. in node.js non serve definire l'oggetto
     // che comunque avrà la forma del tipo
     // {
     //    tag : String,
     //    scelta : String,
     //    time_word : String
     // }

});

module.exports = mongoose.model('GameSession', gameSession);
