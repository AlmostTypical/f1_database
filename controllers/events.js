var Seasons = require('../models/seasons');
var Events = require('../models/events');
var Circuits = require('../models/circuits');
var async = require('async');

module.exports = {
  getAllEvents: getAllEvents
};

function getAllEvents (from, until, finalCallback) {
  // go and find all the events where the date_time
  var query = {};
  if (from && until) {
    // get tome stamps from params
    // check they are valid
    query.date_time = {$gt: from, $lt: until};
  }
  async.waterfall([
    function (callback) {
      Events.find(query, function (err, events) {
        // now pass all the events down our waterfall
        callback(null, events);
      })
    },
    function (events, callback) {
      // get the year for the events and modify the doc
      // hold that season id in memory as we have many rounds to a season and do not need the db every time
      var season_id = '';
      var year = '';
      var returnEvents = [];
      var newEvent;
      // async eachSeries on our events
      async.eachSeries(events, function (event, eventCallback) {
        // check the id is the id if so add the year,
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
