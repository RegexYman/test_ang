var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.post('/', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        dbo.collection("simulate_traffic_speed").find().toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.json(jsonResult);
            } else {
                var length = result.length - 1;
                res.json(result[length]);
            }
            db.close();
        });
    });
});

module.exports = router;