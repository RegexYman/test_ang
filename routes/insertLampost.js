var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
// var modle = mongoose.model;

function a(jsonObj){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        dbo.collection("lampost_DB").insertOne(jsonObj, function(err, insertResult) {
            if (err) throw err;
            // res.send("New Lampost Inserted" + insertResult);
          });
    });
}

router.post('/', function (req, res, next) {
    var inID = req.body.lampostID;
    var inPW = req.body.password;
    var linkid = req.body.Link_ID;
    if(inID==null || inPW==null || linkid==null || inID=="" || inPW =="" || linkid == ""){
        res.send("Parameter error");
    }else{
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            var findLampostByID = { lampost_id: inID };
            var findLinkID = { Link_ID: linkid };
            dbo.collection("lampost_DB").find(findLampostByID).toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length > 0) {
                    res.send("Lampost is exist");
                } else {
                    // res.send(result);
                    dbo.collection("tsm_link_info").find(findLinkID).toArray(function (err, result2) {
                        if (err) {
                            throw err;
                        }
                        if (result2.length == 0) {
                            res.send("incorrect LinkID");
                        }else{
                            var myobj = { lampost_id: inID, password: inPW, Link_ID: linkid };
                            a(myobj);
                            db.close();
                            res.send({"message" : "success"});
                        }
                    });
                }
                
            });
        });
    }
});

module.exports = router;