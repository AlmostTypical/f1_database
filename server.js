var express = require('express');
var app = express();
var mongoose = require('mongoose');
var apiRouter = require('./routes/api');
var ejs = require('ejs');
var viewsRouter = require('./routes/views');
mongoose.connect('mongodb://localhost:27017/formulaOne');

app.use('/api', apiRouter);
app.use('/', viewsRouter);


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');




app.listen(3000, function () {
  console.log('express listening on port 3000')
});



