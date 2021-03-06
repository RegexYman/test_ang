var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.post('/', function(req, res, next) {
    var lID = req.body.link_ID;
    var yyyy = req.body.yyyy;
    var mm = req.body.mm;
    var dd = req.body.dd;
    var hh = req.body.hh;
    var captureDate = req.body.capture_date;
    var latest = req.body.latest;
    if(yyyy != null && mm != null && dd != null && hh !=null && lID != null){
        regexSearchWHour(res,yyyy,mm,dd,hh,lID);
    }else if (yyyy != null && mm != null && dd != null && hh == null && lID != null){
        regexSearch(res,yyyy,mm,dd,lID);
    }
    else{
        if(lID != null && lID != ""){
            if(captureDate != null && captureDate != ""){
                if(captureDate.charAt(4) == "-" && captureDate.charAt(7) == "-" && captureDate.charAt(10) == "T" && captureDate.charAt(13) == ":"){
                    getStatusByLIDandDate(res,lID,captureDate);
                }else{
                    res.json({sucess: false, message:"date time format error"});
                }
            }else if(latest != null && latest != ""){
                if(latest == true || latest == "true"){
                    getLatestStatusByLID(res,lID);
                }else{
                    getOldestStatusByID(res,lID);
                }
            }else{
                //"3006-30069"
                getStatusByLID(res,lID);
            }
        }else{
            res.json({success: false, message: "please enter link id"});
        }
    }
});

function regexSearchWHour(res,yyyy,mm,dd,hh,lID){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {'jtis_speedlist.jtis_speedmap.CAPTURE_DATE._text':{$regex: yyyy+"-"+mm+"-"+dd+"T"+hh+".*"}};
        console.log(query);
        dbo.collection("Raw_SpeedMap").find(query).toArray(function (err, result) {
            // console.log(result);
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.json(jsonResult);
            } else {
                var finalResult = new Array();
                for(var i = 0 ; i < result.length ; i++){
                    for(var j = 0 ; j < result[i].jtis_speedlist.jtis_speedmap.length ; j++){
                        if(result[i].jtis_speedlist.jtis_speedmap[j].LINK_ID._text == lID){
                            finalResult.push(result[i].jtis_speedlist.jtis_speedmap[j]);
                        }
                    }
                }
                res.json(finalResult);
            }
            db.close();
        });
    });
}

function regexSearch(res,yyyy,mm,dd,linkID){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {'jtis_speedlist.jtis_speedmap.CAPTURE_DATE._text':{$regex: yyyy+"-"+mm+"-"+dd+".*"}};
        console.log(query);
        dbo.collection("Raw_SpeedMap").find(query).toArray(function (err, result) {
            // console.log(result);
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.json(jsonResult);
            } else {
                var finalResult = new Array();
                for(var i = 0 ; i < result.length ; i++){
                    for(var j = 0 ; j < result[i].jtis_speedlist.jtis_speedmap.length ; j++){
                        if(result[i].jtis_speedlist.jtis_speedmap[j].LINK_ID._text == linkID){
                            finalResult.push(result[i].jtis_speedlist.jtis_speedmap[j]);
                        }
                    }
                }
                res.json(finalResult);
            }
            db.close();
        });
    });
}

function getStatusByLID(res,linkID){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {'jtis_speedlist.jtis_speedmap.LINK_ID._text':linkID};
        dbo.collection("Raw_SpeedMap").find(query).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.json(jsonResult);
            } else {
                var finalResult = new Array();
                for(var i = 0 ; i < result.length ; i++){
                    for(var j = 0 ; j < result[i].jtis_speedlist.jtis_speedmap.length ; j++){
                        if(result[i].jtis_speedlist.jtis_speedmap[j].LINK_ID._text == linkID){
                            finalResult.push(result[i].jtis_speedlist.jtis_speedmap[j]);
                        }
                    }
                }
                res.json(finalResult);
            }
            db.close();
        });
    });
}

function getStatusByLIDandDate(res,linkID,captureDate){
    console.log("123");
    //{$and : [{'jtis_speedlist.jtis_speedmap.CAPTURE_DATE._text':"2018-01-22T21:40:35"}
    //,{'jtis_speedlist.jtis_speedmap.LINK_ID._text':"3006-30069"}]}
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {$and : [{'jtis_speedlist.jtis_speedmap.CAPTURE_DATE._text':captureDate},{'jtis_speedlist.jtis_speedmap.LINK_ID._text':linkID}]};
        dbo.collection("Raw_SpeedMap").find(query).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.json(jsonResult);
            } else {
                var finalResult = new Array();
                for(var i = 0 ; i < result.length ; i++){
                    for(var j = 0 ; j < result[i].jtis_speedlist.jtis_speedmap.length ; j++){
                        if(result[i].jtis_speedlist.jtis_speedmap[j].LINK_ID._text == linkID){
                            finalResult.push(result[i].jtis_speedlist.jtis_speedmap[j]);
                        }
                    }
                }
                res.json(finalResult);
            }
            db.close();
        });
    });
}

function getLatestStatusByLID(res,linkID){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {'jtis_speedlist.jtis_speedmap.LINK_ID._text':linkID};
        dbo.collection("Raw_SpeedMap").find(query).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.json(jsonResult);
            } else {
                var finalResult ;
                for(var j = 0 ; j < result[result.length-1].jtis_speedlist.jtis_speedmap.length ; j++){
                    if(result[result.length-1].jtis_speedlist.jtis_speedmap[j].LINK_ID._text == linkID){
                        finalResult = result[result.length-1].jtis_speedlist.jtis_speedmap[j];
                    }
                }
                res.json(finalResult);
            }
            db.close();
        });
    });
}

function getOldestStatusByID(res,linkID){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {'jtis_speedlist.jtis_speedmap.LINK_ID._text':linkID};
        dbo.collection("Raw_SpeedMap").find(query).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.json(jsonResult);
            } else {
                var finalResult ;
                for(var j = 0 ; j < result[0].jtis_speedlist.jtis_speedmap.length ; j++){
                    if(result[0].jtis_speedlist.jtis_speedmap[j].LINK_ID._text == linkID){
                        finalResult = result[0].jtis_speedlist.jtis_speedmap[j];
                    }
                }
                res.json(finalResult);
            }
            db.close();
        });
    });
}


module.exports = router;