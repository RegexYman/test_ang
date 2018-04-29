var express = require('express');
var router = express.Router();
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.post('/', function (req, res, next) {
    let {yyyy,mm,dd} = req.body;
    if(yyyy != null && mm != null && dd != null){
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            var query = {record_date : yyyy+"-"+mm+"-"+dd};
            dbo.collection("day_average_speed").find(query).toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    var jsonResult = {message:"no record found",result:""};
                    res.json(jsonResult);
                } else {
                    res.json(result);
                }
                db.close();
            });
        });
    }else{
        if(yyyy == null ){
            yyyy = ".*";
        }
        if(mm == null){
            mm = ".*";
        }
        if(dd != null){
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("fyp_test");
                var query = {record_date : { $regex : yyyy+"-"+mm+"-"+dd}};
                console.log(query);
                dbo.collection("day_average_speed").find(query).toArray(function (err, result) {
                    if (err) {
                        throw err;
                    }
                    if (result.length == 0) {
                        var jsonResult = {message:"no record found",result:""};
                        res.json(jsonResult);
                    } else {
                        res.json(result);
                    }
                    db.close();
                });
            });
        }else{
            res.json({message:"parameter error",result:""})
        }
    }
});

module.exports = router;