var Circuits = require('../models/circuits');

module.exports = {
  getCircuits: getCircuits
};

function getCircuits(query, callback) {
  console.log('Called getCircuits controller');
  Circuits.find(query, function (err, circuits) {
    if (err) {
      return callback(err);
    }
    callback(null, circuits)
  })
};