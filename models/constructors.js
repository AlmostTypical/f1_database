var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var constructorSchema = new Schema({
  constructorId: String,
  url: String,
  name: String,
  nationality: String
});

module.exports = mongoose.model('Constructors', constructorSchema);
