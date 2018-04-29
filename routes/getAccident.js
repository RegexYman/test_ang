var express = require('express');
var router = express.Router();
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.post('/', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {End_Time : null};
        dbo.collection("accident").find(query).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                res.json({success: false, message: "No accident"});
            } else {
                res.json(result);
            }
        });
    });
});

module.exports = router;