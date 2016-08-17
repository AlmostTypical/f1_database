var Seasons = require('../models/seasons');
var Events = require('../models/events');
var Circuits = require('../models/circuits');
var async = require('async');
var express = require('express');

module.exports = {
  getSeasons: getSeasons,
  getSeasonsEvents: getSeasonsEvents,
  getSeasonsEvent: getSeasonsEvent
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
      async.eachSeries(events, function (event, eachCallback) { // async version of eachOf, will go through array
        event = event.toObject(); // workaround for JSON being a dick
        Circuits.findById(event.circuit_id, function (err, circuit) {  // .findById is from Mongoose //  find circuits by their id
          data[event.round] = {  // create object entry for each event by their round number
            time: event.date_time,
            circuit: circuit
          };
          eachCallback()
        });
      }, function (err) {
        callback(null, 'FINISHED'); // only called when there is an error
      })
    }
  ], function (err, result) {
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


