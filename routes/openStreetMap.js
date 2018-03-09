var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var app = express.createServer();


/* GET users listing. */
app.use('/', function(req, res, next) {
    res.sendfile(__dirname + "/simplegeo/examples/streetsTest/streets.html");
});

module.exports = router;
