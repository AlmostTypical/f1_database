var express = require('express');
var router = express.Router();
var seasonsController = require('../controllers/seasons');
var driversController = require('../controllers/drivers');
var constructorController = require('../controllers/constructors');

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

router.get('/constructor', function (req, res) {
  constructorController.getConstructors({}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  })
});

router.get('/constructor/:constructor_id', function (req, res){
  constructorController.getConstructors({constructorId: req.params.constructor_id}, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data)
  });
});


module.exports = router;