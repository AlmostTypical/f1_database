var Constructors = require('../models/constructors');

module.exports = {
  getConstructors: getConstructors
};

function getConstructors(query, callback) {
  console.log('Called getConstructors controller');
  Constructors.find(query, function (err, constructors) {
    if (err) {
      return callback(err);
    }
    callback(null, constructors)
  })
};