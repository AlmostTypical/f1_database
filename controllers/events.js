var Seasons = require('../models/seasons');
var Events = require('../models/events');
var Circuits = require('../models/circuits');
var async = require('async');

module.exports = {
  getAllEvents: getAllEvents
};

function getAllEvents (from, until, finalCallback) {
  console.log(arguments);
  var query = {};
  if (from && until) {
    query.date_time = {$gt: from, $lt: until}; // from and until are definitely numbers here inside an object
  }
  async.waterfall([
    function (callback) { // query is being passed down correctly
      console.log(query); // query has times in JS format, should be returning everything from 1998 to 2004 with above params.
      Events.find(query, function (err, events) { // query === { date_time: { '$gt': 883612800000, '$lt': 1072915200000 } }
        console.log(events); // events unpopulated for some reason when query is present, fine with no query
        callback(null, events); // Now pass all the events down our waterfall, in this case NOTHING :(
      })
    },
    function (events, callback) {
      var season_id = '';
      var year = '';
      var returnEvents = [];
      var newEvent;
      async.eachSeries(events, function (event, eventCallback) {
        event = event.toObject();
        if (event.season_id === season_id) {
          newEvent = {
            date_time: event.date_time,
            season: year,
            round: event.round,
            circuit_id: event.circuit_id
          };
          return eventCallback();
        }
        Seasons.findById(event.season_id, function (error, season) {
          // otherwise do a db fetch, add the year and then reset the variables
          if (error) {
            return callback(error);
          }
          season = season.toObject();
          season_id = season._id;
          year = season.season;
          newEvent = {
            date_time: event.date_time,
            season: year,
            round: event.round,
            circuit_id: event.circuit_id
          };
          returnEvents.push(newEvent);
          eventCallback();
        });
      }, function () {
        // callback with all our modified events
        callback(null, returnEvents);
      });
    },
    function (events, callback) {
      // now we just need the circuit for that event
      // we should also create a 'map' for our circuits so we don't do db look ups and the circuits are usually used more than once
      var circuitsMap = {};

      // again lets us a eachSeries
      async.eachSeries(events, function (event, eventCallback) {
        if (circuitsMap[event.circuit_id]){
          event.circuit = circuitsMap[event.circuit_id];
          return eventCallback();
        }
        // otherwise do a db fetch, add the year and add it to the map
        Circuits.findById(event.circuit_id, function (error, circuit) {
          if (error) {
            return callback(error);
          }
          circuit = circuit.toObject();
          event.circuit = circuit;
          circuitsMap[event.circuit_id] = circuit;
          eventCallback();
        });
      }, function () {
        callback(null, events);
      })
    }
  ], function (error, events) {
    finalCallback(null, events);
  });


}
