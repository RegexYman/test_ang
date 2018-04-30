var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var today = new Date();
var dd = today.getDate().toString();
var mm = (today.getMonth()+1).toString(); //January is 0!
var yyyy = today.getFullYear().toString();
var hh = today.getHours().toString();
var min = today.getMinutes().toString();
// mm = 12;
if(mm.length == 1){
    mm = "0"+mm
}
if(dd.length == 1){
    dd = "0"+dd;
}
if(hh.length == 1){
    hh = "0"+hh;
}

router.get('/', function(req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = {date:{$regex: yyyy+"-"+mm+"-"+dd+"T"+hh+".*"}};
        console.log(query);
        dbo.collection("web_map_data").find(query).toArray(function (err, result) {
            // console.log(result);
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                var jsonResult = {message:"no record found",result:""};
                res.json(jsonResult);
            } else {
                console.log(result[result.length - 1].date)
                res.json(result[result.length - 1]);
            }
            db.close();
        });
    });
});

module.exports = router;