var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.post('/', function (req, res, next) {
    var inID = req.body.lampostID;
    var inPW = req.body.password;
    // var message;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = { lampost_id: inID, password: inPW };
        dbo.collection("lampost_DB").find(query).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                res.json({success: false, message: "Lampost Not Found"});
            } else {
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
                if(min.length == 1){
                    min = "0"+min
                }
                var vdate = yyyy+"-"+mm+"-"+dd+"T"+hh;
                var findTrafficSpeedObj = { 'jtis_speedlist.jtis_speedmap.CAPTURE_DATE._text': { $regex: vdate+"+:+.+:+." } };
                console.log(findTrafficSpeedObj);
                dbo.collection("Raw_SpeedMap").find(findTrafficSpeedObj).toArray()
                    .then((result2) => {
                        // console.log(result2);
                        // console.log(result2.jtis_speedlist.jtis_speedmap[0]);
                        var preResult = result2[result2.length - 1];
                        // console.log(preResult);
                        var finalResult;
                        for (var i = 0; i < preResult.jtis_speedlist.jtis_speedmap.length; i++) {
                            if (preResult.jtis_speedlist.jtis_speedmap[i].LINK_ID._text == result[0].Link_ID) {
                                finalResult = preResult.jtis_speedlist.jtis_speedmap[i];
                                break;
                            }
                        }
                        if (finalResult == null) {
                            res.json({success: false, message:"No Such Lampost"});
                        } else {
                            var tfJSON, redLight, greenLight;
                            var currSpeed = finalResult.TRAFFIC_SPEED._text;
                            if (finalResult.ROAD_SATURATION_LEVEL._text == "TRAFFIC GOOD") {
                                redLight = (currSpeed * 2);
                                greenLight = (currSpeed) * 1;
                                tfJSON = { "redLightTime": redLight, "greenLightTime": greenLight };
                            } else if (finalResult.ROAD_SATURATION_LEVEL._text == "TRAFFIC AVERAGE") {
                                redLight = (currSpeed * 2);
                                greenLight = (currSpeed * 3);
                                tfJSON = { "redLightTime": redLight, "greenLightTime": greenLight };
                            } else if (finalResult.ROAD_SATURATION_LEVEL._text == "TRAFFIC BAD") {
                                redLight = (currSpeed) * 1;
                                greenLight = (currSpeed * 4);
                                tfJSON = { "redLightTime": redLight, "greenLightTime": greenLight };
                            } else {
                                tfJSON = null;
                            }
                            res.send({success: true,capture_date: preResult.jtis_speedlist.jtis_speedmap[0].CAPTURE_DATE._text,  current_speed: currSpeed, tfJSON });
                            db.close();
                        }
                    });
            }
        });
    });
});

module.exports = router;
