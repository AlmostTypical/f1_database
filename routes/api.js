var express = require('express');
var router = express.Router();
var seasonsController = require('../controllers/seasons');
var Seasons = require('../models/seasons.js');

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


module.exports = router;