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
    getSeasons({season: year}, function (err, seasons) {
      var season = seasons[0];
      data.link = season.url;
      callback(null, season._id)
    })
    },
    function (seasonId, callback) {
      Events.find({season_id: seasonId}, function (err, events) {
        callback(null, events)
      });
    },
    function (events, callback) {
      async.eachSeries(events, function (event, eachCallback) {
        event = event.toObject();
        Circuits.findById(event.circuit_id, function (err, circuit) {
          data[event.round] = {
            time: event.date_time,
            circuit: circuit
          };
          eachCallback()
        });
      }, function (err) {
        callback(null, 'FINISHED')
      })
    }
  ], function (err, result) {
    finalCb(err, data);
  });

}