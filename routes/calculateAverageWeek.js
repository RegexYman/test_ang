var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var currDate = Date.now();

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
    min = "0" + min
}

var vdate = yyyy + "-" + mm + "-" + dd + "T" + hh + "+:+.+:+.";
var vdate2 = yyyy + "-" + mm + "-" + dd + "T" + hh + ":"+ min ;

console.log(vdate);
console.log(vdate2);
getLinkIDlist();
// getData(vdate);

function getLinkIDlist() {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = { 'jtis_speedlist.jtis_speedmap.CAPTURE_DATE._text': { $regex: vdate } };
        dbo.collection("Raw_SpeedMap").find(query).toArray(async function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                jsonResult = { message: "no record found", result: "" };
                console.log(jsonResult);
            } else {
                looper(result).then((list)=>{
                    averageCalculator(list, result, result.length).then((next)=>{
                        var j = {hour : hh , generation_date : vdate2, generation_date_long: ""+today}
                        j.hour_speed_average = next;
                        insertIntoDB(j);
                    })
                });
            }
            db.close();
        });
    });
}

function looper(result) {
    var a = [];
    return new Promise((resolve, reject) => {
        for (var i = 0; i < result[0].jtis_speedlist.jtis_speedmap.length; i++) {
            a.push(result[0].jtis_speedlist.jtis_speedmap[i].LINK_ID._text);
        }
        resolve(a);
    });
}

function averageCalculator(list, resultSet, amount) {
    console.log("amount: " + amount);
    return new Promise((resolve, reject)=> {
        var finalJson = [];
        // console.log(resultSet[0].jtis_speedlist.jtis_speedmap[0].TRAFFIC_SPEED._text);
        for(var i = 0 ; i < list.length ; i++){
            var temp = list[i];
            var temp2 = 0;
            for(var j = 0 ; j < resultSet.length; j++){
                for(var k = 0 ; k < resultSet[j].jtis_speedlist.jtis_speedmap.length; k++){
                    if(resultSet[j].jtis_speedlist.jtis_speedmap[k].LINK_ID._text === temp){
                        temp2 += parseInt(resultSet[j].jtis_speedlist.jtis_speedmap[k].TRAFFIC_SPEED._text);
                    }
                }
            }
            finalJson.push((temp2/amount).toFixed(1));
        }
        resolve(finalJson);
    })
}

function insertIntoDB(json){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        dbo.collection("hour_average_speed").insertOne(json, function(err, res) {
          if (err) throw err;
          console.log("1 record inserted");
          db.close();
        });
      }); 
}
