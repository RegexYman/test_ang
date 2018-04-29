var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var today = new Date();
var dd = today.getDate().toString();
var mm = (today.getMonth() + 1).toString(); //January is 0!
var yyyy = today.getFullYear().toString();
var hh = today.getHours().toString();
var hhCur = today.getHours().toString();
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
if (hhCur.length == 1) {
    hhCur = "0" + hhCur;
}

var vdate = yyyy + "-" + mm + "-" + dd + "T" + hhCur + ":"+ min ;

var forecastJson = {
    Description: "test",
};

var accidentJson = {
    Description: "test",
};

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("fyp_test");
    dbo.collection("traffic_jam_forecast").remove(forecastJson, function (err, res) {
        if (err) throw err;
        console.log("test record deleted");
        db.close();
    });
}); 

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("fyp_test");
    dbo.collection("accident").remove(accidentJson, function (err, res) {
        if (err) throw err;
        console.log("test record deleted");
        db.close();
    });
}); 