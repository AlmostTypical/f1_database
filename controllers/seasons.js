var Seasons = require('../models/seasons');
var Events = require('../models/events');
var Circuits = require('../models/circuits');
var async = require('async');
var express = require('express');

module.exports = {
  getSeasons: getSeasons,
  getSeasonsEvents: getSeasonsEvents
};

function getSeasons(query, callback) {
  console.log('Called getSeasons controller');
  Seasons.find(query, function (err, seasons) {
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
    getSeasons({season: year}, function (err, seasons) { // find season by season year
      var season = seasons[0]; // select season from array of single season
      data.link = season.url;
      callback(null, season._id); // pass down season id to callback
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
        Circuits.findById(event.circuit_id, function (err, circuit) {  // find circuits by their id
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