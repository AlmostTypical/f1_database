var express = require('express');
var app = express();
var mongoose = require('mongoose');

var Seasons = require('./models/seasons');

mongoose.connect('mongodb://localhost:27017/formulaOne');

app.get('/', function (req, res) {
  res.send('This is the Formula One Database site!!1');
});

app.listen(3000, function () {
  console.log('express listening on port 3000')
});

app.get('/api', function (req, res) {
  res.status(200).json({status: 'hunkydory'})
});

app.get('/api/seasons', function (req, res) {
  var seasons = Seasons.find({}, function (err, seasons) {
    res.status(200).json(seasons)
  })
});

app.get('/api/seasons/:season_year', function (req, res){
  var season_year = Seasons.findOne({season: req.params.season_year}, function (err, season){
    res.status(200).json({season : season})
  })
});

