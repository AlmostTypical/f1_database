var express = require('express');
var router = express.Router();
// extract out our logic that controls each route into our controllers
var seasonsController = require('../controllers/seasons');

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