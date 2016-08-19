var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  season_id: String,
  round: Number,
  circuit_id: String,
  date_time: Number
});

module.exports = mongoose.model('Events', eventSchema);
