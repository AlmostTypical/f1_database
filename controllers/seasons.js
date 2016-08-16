var Seasons = require('../models/seasons');

module.exports = {
  getSeasons: getSeasons
};

function getSeasons(query, callback) {
  console.log('Called getSeasons controller');
  Seasons.find(query, function (err, seasons) {
    if (err) {
      return callback(err);
    }
    callback(null, seasons)
  })
};