var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var convert = require('xml-js');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var journeytimeTest = require('./routes/journeytimeTest');
var getTrafficLightTime = require('./routes/getTrafficLightTime');
var insertLampost = require('./routes/insertLampost');
var insertApiData= require('./routes/insertApiData');
var getTrafficSpeeds = require('./routes/getTrafficSpeeds');
var getTrafficStat = require('./routes/getTrafficStat');
var getTrafficSpeedByLID = require('./routes/getTrafficSpeedByLID');
var getGeoByLID = require('./routes/getGeoByLID');
var getGeoByLocation = require('./routes/getGeoByLocation');
var getJourneyTime = require('./routes/getJourneyTime');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fyp_test');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}));

app.use('/', index);
app.use('/users', users);
app.use('/journeytimeTest', journeytimeTest);
app.use('/getTrafficLightTime', getTrafficLightTime);
app.use('/insertLampost', insertLampost);
app.use('/insertApiData', insertApiData);
app.use('/getTrafficSpeeds', getTrafficSpeeds);
app.use('/getTrafficStat',getTrafficStat);
app.use('/getTrafficSpeedByLID',getTrafficSpeedByLID);
app.use('/getGeoByLID',getGeoByLID);
app.use('/getGeoByLocation',getGeoByLocation);
app.use('/getJourneyTime',getJourneyTime);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3000);
// app.get('/streetsMap', function(req,res){
//   res.sendfile(path.join(__dirname + '/public/simplegeo/examples/streetsTest/streets.html'));
//  }); 

// app.use('/streetsMap', express.static(__dirname + 'public'));

// app.use('/streetMap',(res,req) => {express.static(__dirname + '/public/simplegeo/examples/streetsTest/streets.html')})

module.exports = app;
