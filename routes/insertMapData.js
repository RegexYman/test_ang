var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var today = new Date();
var dd = today.getDate().toString();
var mm = (today.getMonth() + 1).toString(); //January is 0!
var yyyy = today.getFullYear().toString();
var hh = today.getHours().toString();
var min = today.getMinutes().toString();

if (mm.length == 1) {
    mm = "0" + mm
}
if (dd.length == 1) {
    dd = "0" + dd;
}
if (hh.length == 1) {
    hh = "0" + hh;
}
if (min.length == 1) {
    min = "0" + min;
}

var vdate = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + min ;

var speedMapData = [];
var geoInfo = [];

getRawSpeedMap().then(()=>{
    getGeoInfo().then(()=>{
        combind().then((json)=>{
            // console.log(json);
            insertMapData(json);
        })
    })
})


function getRawSpeedMap() {
    return new Promise((resolve,reject)=>{
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            var query = { 'jtis_speedlist.jtis_speedmap.CAPTURE_DATE._text': { $regex: yyyy + "-" + mm + "-" + dd + "T" + hh + ".*" } };
            console.log(query);
            dbo.collection("Raw_SpeedMap").find(query).toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    var jsonResult = { message: "no record found", result: "" };
                    console.log(jsonResult);
                } else {
                    speedMapData = result[result.length - 1].jtis_speedlist.jtis_speedmap;
                    console.log("length : " + result.length);
                    // console.log(speedMapData);
                    console.log(speedMapData.length);
                    resolve();
                }
                db.close();
            });
        });
    })
}

function getGeoInfo() {
    return new Promise((resolve,reject)=>{
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            dbo.collection("tsm_info").find().toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    var jsonResult = { message: "no record found", result: "" };
                    console.log(jsonResult);
                } else {
                    geoInfo = result;
                    console.log(geoInfo.length);
                    resolve();
                }
                db.close();
            });
        });
    })
}

function combind() {
    return new Promise((resolve, reject) => {
        var finalJson = {
            "date" : vdate,
            "type": "FeatureCollection",
            "features": []
        };

        for (var i = 0; i < speedMapData.length; i++) {
            var tempLid = speedMapData[i].LINK_ID._text;
            var tempSpeed = speedMapData[i].TRAFFIC_SPEED._text;
            var tempSaturation = speedMapData[i].ROAD_SATURATION_LEVEL._text;
            var startLatLong = [];
            var endLatLong = [];
            for (var j = 0; j < geoInfo.length; j++) {
                if (geoInfo[j].Link_ID == tempLid) {
                    startLatLong.push(parseFloat(geoInfo[j].Start_Node_Eastings));
                    startLatLong.push(parseFloat(geoInfo[j].Start_Node_Northings));
                    endLatLong.push(parseFloat(geoInfo[j].End_Node_Eastings));
                    endLatLong.push(parseFloat(geoInfo[j].End_Node_Northings));
                    break;
                }
            }
            finalJson.features.push({
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        startLatLong,
                        endLatLong
                    ],
                },
                "type": "Feature",
                "properties": {
                    "ROAD_SATURATION_LEVEL": tempSaturation,
                    "TRAFFIC_SPEED": tempSpeed
                }
            })
        }
        resolve(finalJson);
    });
}

function insertMapData(json) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        dbo.collection("web_map_data").insertOne(json, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    });
}