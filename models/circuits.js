var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var circuitSchema = new Schema({
  wiki: String,
  name: String,
  location: String
});

module.exports = mongoose.model('Circuits', circuitSchema);
