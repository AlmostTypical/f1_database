var Drivers = require('../models/drivers');
var Events = require('../models/events');
var Results = require('../models/results');
var async = require('async');

module.exports = {
  getDriverRankings: getDriverRankings
};

function getDriverRankings (query, finalCB) {
  async.waterfall([
    // First function: get the data we need from our drivers database
    function(cb) {
      var arrDrivers = [];
      var newDriver = {};
      Drivers.find(query, function (err, drivers) {
        async.eachSeries(drivers, function (driver, driverCB) {
          newDriver.id = driver._id;
          newDriver.name = driver.givenName + ' ' + driver.familyName;
          newDriver.dateOfBirth = driver.dateOfBirth;
          newDriver.nationality = driver.nationality;
          newDriver.url = driver.url;
          newDriver.totalPoints = 0;
          newDriver.totalPoles = 0;
          newDriver.totalTopThree = 0;
          arrDrivers.push(newDriver);
          newDriver = {};
          driverCB();
        });
        cb(null, arrDrivers);
      })
    },
    // Second function: find each driver's results and total up the points
    function(drivers, cb) {
      async.forEach(drivers, function (driver, driverCB) {
        Results.find({driver_id: driver.id}, function (err, results) {
          if (err) {
            return cb(err)
          }
          async.each(results, function (result, resultCB) {
            driver.totalPoints += result.points;
            if (result.position === 1) {
              driver.totalPoles += 1;
            }
            if (typeof result.position === 'number' && result.position <= 3) {
              driver.totalTopThree += 1;
            }
            resultCB();
          }, function () {
            driverCB();
          });
        });
      }, function () {
        cb(null, drivers)
      });
    },
    // Third function: sort drivers by amount of points
    function(drivers, cb) {
      drivers.sort(function (a, b) {
        return b.totalPoints - a.totalPoints
      });
      cb(null, drivers)
    }
  ], function (err, drivers) {
    finalCB(err, drivers)
  })
}