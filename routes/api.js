var express = require('express');
var router = express.Router();
var seasonsController = require('../controllers/seasons');
var driversController = require('../controllers/drivers');
var constructorsController = require('../controllers/constructors');
var circuitsController = require('../controllers/circuits');

router.get('/seasons', function (req, res) {
  seasonsController.getSeasons({}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  });
});

router.get('/seasons/:season_year', function (req, res){
  seasonsController.getSeasons({season: req.params.season_year}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data)
  });
});

router.get('/seasons/:season_year/events', function (req, res) {
  var year = req.params.season_year;
  seasonsController.getSeasonsEvents(year, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data)
  })
});

router.get('/seasons/:season_year/events/:event_number', function (req, res) {
  var round = req.params.event_number;
  var year = req.params.season_year;
  seasonsController.getSeasonsEvent(year, round, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data)
  })
});

router.get('/seasons/:season_year/events/:event_number/results', function (req, res) {
  var round = req.params.event_number;
  var year = req.params.season_year;
  seasonsController.getSeasonsEventResults(year, round, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data)
  })
});


router.get('/drivers', function (req, res) {
  driversController.getDrivers({}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  })
});

router.get('/drivers/:driver_id', function (req, res){
  driversController.getDrivers({driverId: req.params.driver_id}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data)
  });
});

router.get('/constructors', function (req, res) {
  constructorsController.getConstructors({}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  })
});

router.get('/constructors/:constructor_id', function (req, res){
  constructorsController.getConstructors({constructorId: req.params.constructor_id}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data)
  });
});

router.get('/circuits', function (req, res) {
  circuitsController.getCircuits({}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  })
});

router.get('/circuits/:circuit_id', function (req, res){
  circuitsController.getCircuits({_id: req.params.circuit_id}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data)
  });
});

module.exports = router;