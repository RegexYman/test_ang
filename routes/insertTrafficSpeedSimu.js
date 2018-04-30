var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.post('/', function (req, res, next) {
    let {amount, password} = req.body;
    var today = new Date();
    if(amount != null && password != null ){
        if(password === "N1n3@noeJ!21"){
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var json = {
                    date : ""+today,
                    traffic_amount : amount
                };
                var dbo = db.db("fyp_test");
                dbo.collection("simulate_traffic_speed").insertOne(json, function(err, result) {
                  if (err) throw err;
                  res.json({success: true, message: "data inseted"});
                  db.close();
                });
              }); 
        }else{
            res.json({success: false, message : "error"});
        }
    }
});

module.exports = router;