var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var driverSchema = new Schema({
  driverId: String,
  url: String,
  givenName: String,
  familyName: String,
  dateOfBirth: String,
  nationality: String
});

module.exports = mongoose.model('Drivers', driverSchema);
