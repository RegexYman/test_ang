var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var currDate = Date.now();

var today = new Date();
var dd = today.getDate().toString();
var ddCur = today.getDate().toString();
var mm = (today.getMonth() + 1).toString(); //January is 0!
var yyyy = today.getFullYear().toString();
var hh = today.getHours().toString();
var min = today.getMinutes().toString();
console.log(mm);
mm = "" + (mm - 1);
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
    min = "0" + min
}
if(ddCur.length == 1) {
    ddCur = "0" + ddCur;
}

var vdate = yyyy + "-" + mm + "-" + dd + "T+.+:+.+:+.";
var vdate2 = yyyy + "-" + mm ;
var gdate = yyyy + "-" + mm + "-" + ddCur + "T" + hh + ":"+ min ;
console.log(mm.length);
console.log(mm);
console.log(vdate);
console.log(vdate2);
getLinkIDlist();
// getData(vdate);

function getLinkIDlist() {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        // {generation_date:{$regex:"2018-04.*"}}
        // var query = {generation_date_long:{$regex:".*"+dd+".*"+yyyy}};
        var query = {record_date:{$regex:yyyy+"-"+mm+".*"}}
        dbo.collection("day_average_speed").find(query).toArray(async function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                jsonResult = { message: "no record found", result: "" };
                console.log(jsonResult);
            } else {
                console.log("result length: " + result.length);
                console.log(result);
                console.log(result.length);
                console.log(Object.keys(result[0].day_speed_average[0]))
                averageCalculator(result).then((data)=>{
                    var j = {month : ""+mm , record_date: vdate2 , generation_date : gdate, generation_date_long: ""+today}
                    j.month_speed_average = data
                    // console.log(j);
                    insertIntoDB(j);
                });
            }
            db.close();
        });
    });
}

function averageCalculator(list) {
    console.log("amount: " + list.length);
    return new Promise((resolve, reject)=> {
        var finalJson = {};
        var finalList = [];
        var idtemp ;
        var varTemp = 0 ;
        console.log("records a month : " + list.length);
        console.log("records inside a record : " + list[0].day_speed_average.length);
        for(var i = 0 ; i < list[0].day_speed_average.length ; i++){
            var varTemp = 0 ;
            for(var j = 0 ; j < list.length ; j++){
                idtemp = list[j].day_speed_average[i].LINK_ID
                varTemp += parseInt(list[j].day_speed_average[i].values);
            }
            finalList.push({LINK_ID: idtemp, values: (varTemp/list.length).toFixed(1)})
        }
        resolve(finalList);
    })
}

function insertIntoDB(json){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        dbo.collection("month_average_speed").insertOne(json, function(err, res) {
          if (err) throw err;
          console.log("1 record inserted");
          db.close();
        });
      }); 
}