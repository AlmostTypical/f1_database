var Seasons = require('../models/seasons');
var Events = require('../models/events');
var Circuits = require('../models/circuits');
var Results = require('../models/results');
var Drivers = require('../models/drivers');
var Constructors = require('../models/constructors');
var async = require('async');
var express = require('express');

module.exports = {
  getSeasons: getSeasons,
  getSeasonsEvents: getSeasonsEvents,
  getSeasonsEvent: getSeasonsEvent,
  getSeasonsEventResults: getSeasonsEventResults
};

function getSeasons(query, callback) {
  console.log('Called getSeasons controller');
  Seasons.find(query, function (err, seasons) { // capital S tells us this a model //.find is from Mongoose
    if (err) {
      return callback(err);
    }
    callback(null, seasons)
  })
}

function getSeasonsEvents(year, finalCb) {
  console.log('Called getSeasonsEvents controller');
  var data = {
    year: year
  };
  async.waterfall([
    function (callback) {
    getSeasons({season: year}, function (err, seasons) { // a query is an obj so inside {}v//finds season by season year
      var season = seasons[0]; // select season from array of single season
      data.link = season.url;
      callback(null, season._id); // passes down season id to callback
    })
    },
    function (seasonId, callback) {
      Events.find({season_id: seasonId}, function (err, events) { // find all events by season id
        callback(null, events)
      });
    },
    function (events, callback) {
      var allEvents = [];
      var tempObj = {};
      async.eachSeries(events, function (event, eachCallback) { // async version of eachOf, will go through array
        event = event.toObject(); // workaround for JSON being a dick
        Circuits.findById(event.circuit_id, function (err, circuit) {
          // create object entry for each event by their round number
          tempObj.round = event.round;
          tempObj.time = event.date_time;
          tempObj.circuit = circuit;
          allEvents.push(tempObj);
          tempObj = {};
          eachCallback()
        });
      }, function (err) {
        data.events = allEvents;
        callback(null, data); // End of the each function
      })
    }
  ], function (err, data) {
    console.log(data)
    finalCb(err, data);
  });

}

function getSeasonsEvent (year, round, finalCB) {
  // Create data variable object
  var data = {};
  async.waterfall([
  // function 1: use getSeasons to acquire that year's season
  function (callback) {
  getSeasons({season: year}, function (err, seasons) { // a query is an obj so inside {}v//finds season by season year
    var season = seasons[0]; // select season from array of single season
    data.link = season.url; // adds link to season to data
    callback(null, season._id); // passes down season id to callback
  })
  },
  // function 2: return an event based on the round number and pushes relevant data to data
  function (seasonId, callback) {
    Events.find({season_id: seasonId, round: round}, function (err, oneEvent) { // find all events by season id
      oneEvent = oneEvent[0]; // isolate our single event
      data.event_id = oneEvent._id;
      data.year = oneEvent.season;
      data.round = oneEvent.round; // add round to data
      data.date = oneEvent.date_time; // add date/time to data
      callback(null, oneEvent); // pass event data to next function
    });
  }, // function 3: finds circuit info and pushes relevant info to the data object
    function (oneEvent, callback) {
    Circuits.findById({_id: oneEvent.circuit_id}, function (err, circuit) { // finds circuit based on id from event
      data.wiki = circuit.wiki; // pushes wiki info to data
      data.circuit = circuit.name; // pushes circuit name to data
      callback(null, data); // passes data down to final function
    })
    }
  // final function: call finalCB and pass data through to api
  ], function (err, result) {
    finalCB(err, data); // passes final data to api
  })
}

function getSeasonsEventResults (year, round, finalCB) {
  async.waterfall([
    // function 1: use getSeasonsEvent to acquire the one event and it's details
    function (cb) {
      getSeasonsEvent(year, round, function (err, oneEvent) { // use our previous function to save time!
        cb(null, oneEvent); // passes on all that single event data onto the next function
      });
    },
    // function 2: use our event ID to select the results for that single event
    function (oneEvent, cb) {
      Results.find({event_id: oneEvent.event_id.toString()}, function (err, results) { // use event ID to filter results
        cb(null, results); // pass these results onto the next function
      })
    },
    // function 3: create the final object by mapping the results and including driver and constructor data
    function (results, cb) {
      async.map(results, function (result, cb) { // Similar to a map function, but with a callback to make sure it has finished each part before moving on
        async.parallel({ // parallel will run these two functions and won't pass results until they are done
            driver: function (cb) {
              Drivers.findById(result.driver_id).exec(cb); // gather driver data from Drivers
            },
            constructor: function (cb) {
              Constructors.findById(result.constructor_id).exec(cb); // gather constructor data from Constructors
            }
        },
          function (err, asyncResults) { // results from the parallel
            result = result.toObject(); // making sure the results are objects
            delete result.constructor_id; // get rid of the constructor ID from the final object (we don't need it)
            delete result.driver_id; // same again with the driver ID
            result.driver = asyncResults.driver; // sets the property of driver in each result as an object containing all the driver details
            result.constructor = asyncResults.constructor; // same again with the constructors
            cb(err, result); // pass the results out of the mapping function
          });

      }, function (err, results) { // pass the results of the map onto the final function
        cb(null, results)
      })
    }
  ], function (err, results) {
    finalCB(err, results); // passes final data to api
  })
}


