var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultsSchema = new Schema({
  driver_id: String,
  constructor_id: String,
  position: Number,
  points: Number,
  grid: Number,
  laps: Number,
  status: String,
  time: String

});

module.exports = mongoose.model('Results', resultsSchema);
