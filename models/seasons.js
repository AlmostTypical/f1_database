var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seasonSchema = new Schema({
  season: String,
  url: String
});

module.exports = mongoose.model('Seasons', seasonSchema);
