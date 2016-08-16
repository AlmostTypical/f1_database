var Events = require('../models/events');

module.exports = {
  getEvents: getEvents
};

function getEvents(query, callback) {
  console.log('Called getEvents controller');
  Events.find(query, function (err, events) {
    if (err) {
      return callback(err);
    }
    callback(null, events)
  })
};