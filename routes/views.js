var express = require('express');
var router = express.Router();
// extract out our logic that controls each route into our controllers
var seasonsController = require('../controllers/seasons');
var eventsController = require('../controllers/events');


router.get('/events', function (req, res) {
  // we call the controller to get all eventss
  var from, until;
  if (req.query.from && req.query.until) {
    var fromDate = new Date(req.query.from).getTime();
    var untilDate = new Date(req.query.until).getTime();
    from = fromDate ? fromDate : null;
    until = untilDate ? untilDate : null;
  }
  eventsController.getAllEvents(from,until, function (error, data) {
    if (error) {
      return res.status(500).json(error);
    }
    var ejsData = {
      title: 'Events',
      allEvents: data
    };

    res.status(200).render('pages/events', ejsData);
  })
});



router.get('/seasons', function (req, res) {
  // we call the controller to get all seasons
  seasonsController.getSeasons({}, function (error, data) {
    if (error) {
      return res.status(500).json(error);
    }
    var ejsData = {
      title: 'Seasons',
      allSeasons: data
    };

    res.status(200).render('pages/seasons', ejsData);
  })
});

module.exports = router;