var express = require('express');
var router = express.Router();
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.post('/', function (req, res, next) {
    let {yyyy,mm,dd,hh} = req.body;
    if(yyyy != null && mm != null && dd != null){
        if(hh != null){
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("fyp_test");
                var dateFormat = yyyy + "-" + mm + "-" + dd + "T" + hh + ".*"
                console.log(dateFormat);
                var query = {Insert_Time: {$regex: dateFormat }};
                dbo.collection("traffic_jam_forecast").find(query).toArray(function (err, result) {
                    if (err) {
                        throw err;
                    }
                    if (result.length == 0) {
                        res.json({success: false, message: "No forecast"});
                    } else {
                        res.json(result);
                    }
                });
            });
        }else{
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("fyp_test");
                var dateFormat = yyyy + "-" + mm + "-" + dd + ".*"
                console.log(dateFormat);
                var query = {Insert_Time: {$regex: dateFormat }};
                dbo.collection("traffic_jam_forecast").find(query).toArray(function (err, result) {
                    if (err) {
                        throw err;
                    }
                    if (result.length == 0) {
                        res.json({success: false, message: "No forecast"});
                    } else {
                        res.json(result);
                    }
                });
            });
        }
    }else{
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            dbo.collection("traffic_jam_forecast").find().toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    res.json({success: false, message: "No forecast"});
                } else {
                    res.json(result);
                }
            });
        });
    }
});

module.exports = router;