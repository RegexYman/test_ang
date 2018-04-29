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
    Location: "香港柴灣IVE (測試)",
    Street_Number: "87-369",
    Street_Name: "盛泰道",
    District: "東區",
    Region: "香港島",
    Traffic_Speed: "60",
    Journey_Time: "20",
    Detected_Time: vdate,
    Description: "test",
    Insert_Time: vdate
};

var accidentJson = {
    Location: "香港柴灣IVE (測試)",
    Street_Number: "87-369",
    Street_Name: "盛泰道",
    District: "東區",
    Region: "香港島",
    Datetime: vdate,
    Injuries : "1",
    Status : "Police is incharge",
    Description: "test",
    Insert_Time: vdate,
    End_Time : null
};

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("fyp_test");
    dbo.collection("traffic_jam_forecast").insertOne(forecastJson, function (err, res) {
        if (err) throw err;
        console.log("1 record inserted");
        db.close();
    });
}); 

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("fyp_test");
    dbo.collection("accident").insertOne(accidentJson, function (err, res) {
        if (err) throw err;
        console.log("1 record inserted");
        db.close();
    });
}); 