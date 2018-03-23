var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var startTime;


router.post('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    startTime = Date.now();
    console.log(startTime);
    var datetime = req.body.datetime;
    var disaccendingBySpeed = req.body.desc;
    var yyyy = req.body.year;
    var mm = req.body.month;
    var dd = req.body.date;
    var hh = req.body.hour;
    var min = req.body.minute;
    var region = req.body.region;
    var result = null;
    if(datetime != null && datetime!="*"){
        if(datetime.charAt(4) == "-" && datetime.charAt(7) == "-" && datetime.charAt(10) == "T" && datetime.charAt(13) == ":"){
            result = getDataByDatetimeFormat(res,datetime+":35",region);
        }else{
            res.json({status:"datetime format error",error: "wrong datetime format",result:""});
        }
    }else if(datetime == "*"){
        if(region != null){
            result = getAllDataByReageion(region);
            res.json(result);
            console.log(Date.now() - startTime);
        }else{
            getAllData(res);
            console.log(Date.now() - startTime);
        }
    }else{
        if(yyyy != "" && yyyy != null && mm != "" && mm != null && dd != "" && dd != null && hh != "" && hh != "" && min != "" && min != null){
            // var queryDate = "";
            //Capture_Date:"2018-01-16T13:52:35"
            //{Capture_Date:{$regex:".+-+01+-+.+T+.+:+.+:+."}}
            if(yyyy == "*"){
                yyyy = ".+";
            }
            if(mm == "*"){
                mm = "+.+";
            }
            if(dd == "*"){
                dd = "+.+";
            }
            if(hh == "*"){
                hh = "+.+";
            }
            if(min == "*"){
                min = "+.+";
            }
            getDataByDatetimeFormat(res,yyyy+"-"+mm+"-"+dd+"T"+hh+":"+min+":35",region);
        }else{
            if(yyyy == "" && yyyy == null && mm == "" && mm == null && dd == "" && dd == null && hh == "" && hh == null && min == "" && min == null){
                res.send({status:"ready"});
            }else{
                if(yyyy == null || yyyy == ""){
                    yyyy = ".+";
                }
                if(mm == null || mm == ""){
                    mm = "+.+";
                }
                if(dd == null || dd == ""){
                    dd = "+.+";
                }
                if(hh == null || hh == ""){
                    hh = "+.+";
                }
                if(min == null || min == ""){
                    min = "+.+";
                }
                getDataByDatetimeFormat(res,yyyy+"-"+mm+"-"+dd+"T"+hh+":"+min+":35",region);
            }
        }
    }
});

function getDataByDatetimeFormat(res,datetime,region){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {Capture_Date:{$regex:datetime}};
        dbo.collection("speed_maps").find(query).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.send(jsonResult);
                
            } else {
                var finalResult = new Array();
                var temp;
                if(region == "ST" || region == "st"){
                    for (var i = 0 ; i < result.length ; i++){
                        temp = {
                            Capture_Date : result[i].Capture_Date,
                            Speed_List : {
                                ST_Region : result[i].Speed_List.ST_Region
                            }
                        };
                        finalResult.push(temp);
                    }
                    res.json(finalResult);
                }else if (region == "TM" || region == "tm"){
                    for (var i = 0 ; i < result.length ; i++){
                        temp = {
                            Capture_Date : result[i].Capture_Date,
                            Speed_List : {
                                TM_Region : result[i].Speed_List.TM_Region
                            }
                        };
                        finalResult.push(temp);
                    }
                    res.json(finalResult);
                }else if(region == "KL" || region == "kl"){
                    for (var i = 0 ; i < result.length ; i++){
                        temp = {
                            Capture_Date : result[i].Capture_Date,
                            Speed_List : {
                                KL_Region : result[i].Speed_List.KL_Region
                            }
                        };
                        finalResult.push(temp);
                    }
                    res.json(finalResult);
                    console.log(Date.now() - startTime);
                }else if(region == "HK" || region == "hk"){
                    for (var i = 0 ; i < result.length ; i++){
                        temp = {
                            Capture_Date : result[i].Capture_Date,
                            Speed_List : {
                                HK_Region : result[i].Speed_List.HK_Region
                            }
                        };
                        finalResult.push(temp);
                    }
                    res.json(finalResult);
                    console.log(Date.now() - startTime);
                }else{
                    res.json(result);
                    console.log(Date.now() - startTime);
                }
            }
            db.close();
        });
    });
}

function getAllData(res){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        dbo.collection("speed_maps").find().toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"Collection is empty",result:""};
                res.json(jsonResult);
                console.log(Date.now() - startTime);
            }
            else {
                res.json(result);
                console.log(Date.now() - startTime);
            }
        });
        db.close();
    });
}

module.exports = router;
