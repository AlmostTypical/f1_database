var express = require('express');
var app = express();
var mongoose = require('mongoose');
var apiRouter = require('./routes/api');
mongoose.connect('mongodb://localhost:27017/formulaOne');

app.use('/api', apiRouter);

app.listen(3000, function () {
  console.log('express listening on port 3000')
});



