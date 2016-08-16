var Drivers = require('../models/drivers');

module.exports = {
  getDrivers: getDrivers
};

function getDrivers(query, callback) {
  console.log('Called getDrivers controller');
  Drivers.find(query, function (err, drivers) {
    if (err) {
      return callback(err);
    }
    callback(null, drivers)
  })
};