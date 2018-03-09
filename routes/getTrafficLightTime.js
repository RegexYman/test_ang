var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.post('/', function(req, res, next) {
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
                res.send("Lampost Not Found");
            } else {
                var findTrafficSpeedObj = {'jtis_speedlist.jtis_speedmap':{Link_ID: result[0].Link_ID}};
                dbo.collection("Raw_SpeedMap").find().toArray(function (err, result2) {
                    var preResult = result2[result2.length-1];
                    var finalResult;
                    for(var i = 0 ; i < preResult.jtis_speedlist.jtis_speedmap.length ; i++){
                        if(preResult.jtis_speedlist.jtis_speedmap[i].LINK_ID._text == result[0].Link_ID){
                            finalResult = preResult.jtis_speedlist.jtis_speedmap[i];
                            break;
                        }
                    }
                    if(finalResult == null){
                        res.send("No Such Lampost");
                    }else{
                        var tfJSON, redLight, greenLight;
                        var currSpeed = finalResult.TRAFFIC_SPEED._text;
                        if(finalResult.ROAD_SATURATION_LEVEL._text == "TRAFFIC GOOD"){
                            redLight = (currSpeed*2);
                            greenLight = (currSpeed)*1;
                            tfJSON = {"redLightTime":redLight,"greenLightTime":greenLight};
                        }else if(finalResult.ROAD_SATURATION_LEVEL._text == "TRAFFIC AVERAGE"){
                            redLight = (currSpeed*2);
                            greenLight = (currSpeed*3);
                            tfJSON = {"redLightTime":redLight,"greenLightTime":greenLight};
                        }else if(finalResult.ROAD_SATURATION_LEVEL._text == "TRAFFIC BAD"){
                            redLight = (currSpeed)*1;
                            greenLight = (currSpeed*4);
                            tfJSON = {"redLightTime":redLight,"greenLightTime":greenLight};
                        }else{
                            tfJSON = null;
                        }
                        res.send({"current_speed" : currSpeed, tfJSON});
                    }
                });
            }
            db.close();
        });
    });
});

module.exports = router;
