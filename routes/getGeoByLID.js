var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var startTime;


router.post('/', function(req, res, next) {
    var lID = req.body.LinkID;
    if(lID != "" && lID != null){
        getTotalinfo(lID,res);
    }
});

function getTotalinfo(lID,res){
    Promise.all([getTsmInfo(lID),getGeoByID(lID)]).then(data =>{
        var tsmResult = data[0];
        var geoResult = data[1];
        var result = {
            Link_ID : tsmResult.Link_ID,
            Street_Number : geoResult.Street_Number,
            Street_Name : geoResult.Street_Name,
            District_detial : geoResult.District,
            Region_eng : tsmResult.Region,
            Region_chi : geoResult.Region,
            Start_Point : tsmResult.Start_Node,
            Start_Longitude : tsmResult.Start_Node_Eastings,
            Start_Latitude : tsmResult.Start_Node_Northings,
            End_Point : tsmResult.End_Node,
            End_Longitude : tsmResult.End_Node_Eastings,
            End_Latitude : tsmResult.End_Node_Northings,
            Road_Type : tsmResult.Road_Type
        }
        res.json(result);
    });
}


function getTsmInfo(lID){
    var jsonResult;
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            var query = {Link_ID: lID};
            dbo.collection("tsm_info").find(query).toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    jsonResult = {message:"no record found",result:""};
                    resolve(jsonResult);
                } else {
                    jsonResult = result[0];
                    resolve(jsonResult);
                }
                db.close();
            });
        });
    })
}

function getGeoByID(Lid){
    var jsonResult;
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            var query = {Link_ID: ""+Lid};
    
            dbo.collection("tsm_geo").find(query).toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    jsonResult = {message:"no record found",result:""};
                    resolve(jsonResult);
                } else {
                    jsonResult = result[0];
                    resolve(jsonResult);
                }
                db.close();
            });
        });
    })
}

module.exports = router;
