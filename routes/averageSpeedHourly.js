var http = require("http");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fyp_test');
var modle = mongoose.model;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function findAllspeedDataHourly()