var moment = require('moment');
var express = require('express');
var router = express.Router();
// extract out our logic that controls each route into our controllers
var seasonsController = require('../controllers/seasons');
var eventsController = require('../controllers/events');
var driversController = require('../controllers/drivers');


router.get('/events', function (req, res) {
  var from, until;
  if (req.query.from && req.query.until) {
    var fromDate = new Date(req.query.from).getTime();
    var untilDate = new Date(req.query.until).getTime();
    from = fromDate ? fromDate : null;
    until = untilDate ? untilDate : null;
    console.log(typeof fromDate)
  }
  eventsController.getAllEvents(from, until, function (error, data) {
    if (error) {
      return res.status(500).send("Something has gone horribly wrong. Someone probably crammed a swiss roll into the hard drive.");
    }
    var ejsData = {
      title: 'Events',
      allEvents: data,
      moment: moment
    };
    res.status(200).render('pages/events', ejsData);
  })
});

router.get('/seasons', function (req, res) {
  // we call the controller to get all seasons
  seasonsController.getSeasons({}, function (error, data) {
    if (error) {
      return res.status(500).send('Something went wrong.');
    }
    var ejsData = {
      title: 'Seasons',
      allSeasons: data
    };
    res.status(200).render('pages/seasons', ejsData);
  })
});

router.get('/seasons/:season_year', function (req, res) {
  var year = req.params.season_year;
  console.log(req.url);
  seasonsController.getSeasonsEvents(year, function (err, data) {
    if (err) {
      return res.status(500).send("Well, shit.");
    }
    var ejsData = {
      title: req.params.season_year,
      allEvents: data
    };
    res.status(200).render('pages/season_events', ejsData)
  })
});


router.get('/rankings', function (req, res) {
  driversController.getDriverRankings({}, function (err, data) {
    if (err) {
      return res.status(500).send('We done fucked up.')
    }
    var ejsData = {
      title: 'Rankings',
      allRankings: data
    };
    res.status(200).render('pages/rankings', ejsData)
  })
});


module.exports = router;