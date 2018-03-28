var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var currDate = Date.now();

var today = new Date();
var dd = today.getDate().toString();
var mm = (today.getMonth()+1).toString(); //January is 0!
var yyyy = today.getFullYear().toString();
var hh = today.getHours().toString();
var min = today.getMinutes().toString();

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

var vdate = yyyy+"-"+mm+"-"+dd+"T"+hh+"+:+.+:+.";

console.log(vdate);
getData(vdate);

function getData(vdate){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = { 'Capture_Date':{$regex: vdate }};
        dbo.collection("speed_maps").find(query).toArray( async function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                jsonResult = { message: "no record found", result: "" };
                console.log(jsonResult);
            } else {
                console.log(result);
            }
            db.close();
        });
    });
}
