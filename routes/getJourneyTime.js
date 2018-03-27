var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.post('/', function (req, res, next) {
    var locationID = req.body.locationID;
    var time = req.body.time;
    var destinationID = req.body.destinationID;
    if(destinationID != "" && destinationID != null){
        getJourneyByDestination(destinationID,res);
    }else{
        if (locationID != "" && locationID != null) {
            if (time != "" && time != null) {
                getJourneyTimeByTime(time, locationID, res);
            }
            else {
                getJourneyTime(locationID, res);
            }
        }else{
            res.json({
                message: "format error",
                result: ""
            });
        }
    }
});

function getJourneyByDestination(destinationID,res){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = { 'Journey_List.DESTINATION_ID': destinationID };
        dbo.collection("journey_times").find(query).toArray( async function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                jsonResult = { message: "no record found", result: "" };
                res.json(jsonResult);
            } else {
                jsonResult = result[result.length - 1];
                getOneRecDest(destinationID, jsonResult.Journey_List).then(data => {
                    res.json(data);
                });
            }
            db.close();
        });
    });
}

function getJourneyTimeByTime(time, locationID, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = { 'CAPTURE_DATE': time };
        dbo.collection("journey_times").find(query).toArray( function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                jsonResult = { message: "no record found", result: "" };
                res.json(jsonResult);
            } else {
                jsonResult = result[result.length - 1];
                getOneRec(locationID, jsonResult.Journey_List).then(data => {
                    res.json(data);
                });
            }
            db.close();
        });
    });
}

function getJourneyTime(locationID, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = { 'Journey_List.LOCATION_ID': locationID };
        dbo.collection("journey_times").find(query).toArray( async function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                jsonResult = { message: "no record found", result: "" };
                res.json(jsonResult);
            } else {
                jsonResult = result[result.length - 1];
                getOneRec(locationID, jsonResult.Journey_List).then(data => {
                    res.json(data);
                });
            }
            db.close();
        });
    });
}

function getOneRec(locationID, jsonResult) {
    var resArray = new Array();
    return new Promise((resolve, reject) => {
        for (var i = 0; i < jsonResult.length; i++) {
            if (jsonResult[i].LOCATION_ID == locationID) {
                resArray.push(jsonResult[i]);
            }
         }
        resolve(resArray);
    });
}

function getOneRecDest(destinationID, jsonResult) {
    var resArray = new Array();
    return new Promise((resolve, reject) => {
        for (var i = 0; i < jsonResult.length; i++) {
            if (jsonResult[i].DESTINATION_ID == destinationID) {
                resArray.push(jsonResult[i]);
             }
        }
        resolve(resArray);
    });
}

module.exports = router;