var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var circuitData = require('./formula_one_data/mongoData/circuits.json');
var constructorData = require('./formula_one_data/mongoData/constructors.json');
var driverData = require('./formula_one_data/mongoData/drivers.json');
var seasonsData = require('./formula_one_data/seasons/seasons.json');
var eventsBySeason = require('./formula_one_data/events_by_season/all.js');
var results = require('./formula_one_data/results/all.js');
mongoose.connect('mongodb://localhost:27017/formulaOne');
var DocSchema = new Schema({}, {strict: false});
var Circuits = mongoose.model('Circuits', DocSchema);
var Drivers = mongoose.model('Drivers', DocSchema);
var Constructors = mongoose.model('Constructors', DocSchema);
var Seasons = mongoose.model('Seasons', DocSchema);
var Events = mongoose.model('Events', DocSchema);
var Results = mongoose.model('Results', DocSchema);
var circuitMap = {};
var driverMap = {};
var constructorMap = {};
var seasonMap = {};
var eventIdMap = {};

async.series([
  function (callback) {
    async.eachOfSeries(circuitData, function (circuit, key, cb) {
      var circuitDoc = new Circuits(circuit);
      circuitDoc.save(function (error, doc) {
        if (error) {
          return cb(error);
        }
        circuitMap[key] = doc.id;
        cb();
      });
    }, function () {
      callback();
    });
  },
  function (callback) {
    async.eachOfSeries(driverData, function (driver, key, cb) {
      var driverDoc = new Drivers(driver);
      driverDoc.save(function (error, doc) {
        if (error) {
          return cb(error);
        }
        driverMap[key] = doc.id;
        cb();
      });
    }, function () {
      callback();
    });
  },
  function (callback) {
    async.eachOfSeries(constructorData, function (constructor, key, cb) {
      var constructorDoc = new Constructors(constructor);
      constructorDoc.save(function (error, doc) {
        if (error) {
          return cb(error);
        }
        constructorMap[key] = doc.id;
        cb();
      });
    }, function () {
      callback();
    });
  },
  function (callback) {
    async.eachSeries(seasonsData.MRData.SeasonTable.Seasons, function (season, cb) {
      var seasonDoc = new Seasons(season);
      seasonDoc.save(function (error, doc) {
        if (error) {
          return cb(error);
        }
        seasonMap[season.season] = doc.id;
        cb();
      });
    }, function () {
      callback();
    });
  },
  function (callback) {
    async.eachOfSeries(eventsBySeason, function (events, key, cb) {
      async.eachSeries(events, function (event, seriesCb) {
        var date = (new Date(`${event.date}T${event.time}`).getTime());
        if (!date) {
          date = new Date(event.date + 'T12:00').getTime();
        }
        var data = {
          season_id: seasonMap[key],
          round: +event.round,
          circuit_id: circuitMap[event.Circuit.circuitId],
          date_time: date
        };
        var eventDoc = new Events(data);
        eventDoc.save(function (error, doc) {
          if (error) {
            return cb(error);
          }
          if (!eventIdMap[key]) {
            eventIdMap[key] = {};
          }
          eventIdMap[key][eventDoc.round] = doc.id;
          seriesCb();
        });
      }, function () {
        cb();
      });
    }, function () {
      callback();
    });
  },
  function (callback) {
    async.eachOfSeries(results, function (season, year, resultsCallback) {
      async.eachOfSeries(season, function (race, round, seasonCallback) {
        async.eachOfSeries(race, function (dataForPosition, position, positionCallback) {
          var data = {
            event_id: eventIdMap[year][round],
            driver_id: driverMap[dataForPosition.driver.driverId],
            constructor_id: constructorMap[dataForPosition.constructor],
            position: +position,
            points: +dataForPosition.points,
            grid: +dataForPosition.grid,
            laps: +dataForPosition.laps,
            status: dataForPosition.status,
            time: dataForPosition.time === 'N/A' ? 'N/A' : +dataForPosition.time
          };
          var resultDoc = new Results(data);
          resultDoc.save(function () {
            setTimeout(function () {
              positionCallback();
            }, 10);
          });
        }, function () {
          seasonCallback();
        });
      }, function () {
        resultsCallback();
      });
    }, function () {
      callback();
    });
  }
], function () {
  console.log('Database Seeded');
  process.exit();
});
