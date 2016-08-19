var Seasons = require('../models/seasons');
var Events = require('../models/events');
var Circuits = require('../models/circuits');
var async = require('async');

module.exports = {
  getAllEvents: getAllEvents
};

function getAllEvents (from, until, finalCallback) {
  var query = {};
  if (from && until) { // If a query has been passed over from the route...
    query.date_time = {$gt: from, $lt: until}; // ...organise it into a format that Mongoose can understand.
  }
  async.waterfall([
    // First function: take our query data and find what we need from our events database.
    function (callback) {
      Events.find(query, function (err, events) { // Find the events that match our query.
        callback(null, events); // Pass our events along to the next function.
      })
    },
    // Second function: get what we need from our events and organise them into an array of objects.
    function (events, callback) {
      var season_id = '';
      var year = '';
      var returnEvents = []; // we'll use this as our final array for passing on to the next function.
      var newEvent; // this will be our temporary object that will get reset after each push.
      async.eachSeries(events, function (event, eventCallback) { // Similar to a forEach function but in async
        event = event.toObject();
        if (event.season_id === season_id) { // if this event matches the season, then...
          newEvent = { // stick it all in our temporary variable which will be added to until we hit the end of the season
            date_time: event.date_time,
            season: year,
            round: event.round,
            circuit_id: event.circuit_id
          };
          return eventCallback(); // Use our callback to tell the async each to move onto the next element
        }
        Seasons.findById(event.season_id, function (error, season) { // If our season Id doesn't match, we create a new season and move on
          if (error) {
            return callback(error);
          }
          season = season.toObject();
          season_id = season._id; // This is where all the variables are reset ready for the new season.
          year = season.season;
          newEvent = {
            date_time: event.date_time,
            season: year,
            round: event.round,
            circuit_id: event.circuit_id
          };
          returnEvents.push(newEvent); // Push whatever we have made in newEvent into returnEvents ready to be passed on.
          eventCallback();
        });
      }, function () {
        callback(null, returnEvents); // Callback with our finished events array and pass on to the next function
      });
    },
    // Third function: grab our circuit information
    function (events, callback) {
      var circuitsMap = {}; // By mapping into this, we can avoid duplicate circuits or events.
      async.eachSeries(events, function (event, eventCallback) { // Another eachSeries like above to work through all our circuits.
        if (circuitsMap[event.circuit_id]){ // If we've found our circuit for this year event...
          event.circuit = circuitsMap[event.circuit_id]; // ... then add it to the map.
          return eventCallback();
        }
        Circuits.findById(event.circuit_id, function (error, circuit) { // Otherwise, we find what we need in the db
          if (error) {
            return callback(error);
          }
          circuit = circuit.toObject();
          event.circuit = circuit;                  // Formatting the data into what we need to pass on.
          circuitsMap[event.circuit_id] = circuit;
          eventCallback();
        });
      }, function () {
        callback(null, events); // Final callback of this function to pass our data onto the final function.
      })
    }
    // Now we pass on our data out into the views route to be dealt with there.
  ], function (error, events) {
    finalCallback(null, events);
  });


}
