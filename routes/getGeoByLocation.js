var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var startTime;


router.post('/', function (req, res, next) {
    var region = req.body.region; //big
    var district = req.body.district; //small
    if (region != "" && region != null) {
        if (district != "" && district != null) {

        } else {
            getLIDByRegion(region, res);
        }
    }
});

function getLIDByRegion(region, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        dbo.collection("tsm_geo").find({ Region: "" + region }).toArray(async function (err, result) {
            var resulID;
            if (err) {
                throw err;
            }
            if (result.length == 0) {
                resulID = {
                    message: "no such record",
                    result: ""
                };
                res.json(resulID);
            }
            else {
                var Link_IDs = new Array();
                for (var i = 0; i < result.length; i++) {
                    Link_IDs.push(result[i].Link_ID);
                }
                resulID = { Link_IDs };
                getTotalinfo(resulID).then(async datas => {
                    res.json(datas)
                });
            }
        });
        db.close();
    });
}

function getTotalinfo(resulIDs) {
    var arr = resulIDs.Link_IDs;
    return new Promise((resolve, reject) => {
        // Promise.all(arr.map(x=>Promise.all([getTsmInfo(x), getGeoByID(x)])))

        Promise.all(arr.reduce(function (a, b) { return a.concat(b); }, []))
            .then(function (results) {
                resolve(results)

            });
    });
}


// function getTotalinfo(resulIDs) {
//     var arr = resulIDs.Link_IDs;
//     return new Promise((resolve, reject) => {

//         resolve(arr.map(x => Promise.all([getTsmInfo(e), getGeoByID(e)])).map(element => {
//             element.then(data => {
//                 var tsmResult = data[0];
//                 var geoResult = data[1];
//                 var result = {
//                     Link_ID: tsmResult.Link_ID,
//                     Street_Number: geoResult.Street_Number,
//                     Street_Name: geoResult.Street_Name,
//                     District_detial: geoResult.District,
//                     Region_eng: tsmResult.District,
//                     Region_chi: geoResult.Region,
//                     Start_Point: tsmResult.Start_Point,
//                     Start_Longitude: tsmResult.Start_Longitude,
//                     Start_Latitude: tsmResult.Start_Latitude,
//                     End_Point: tsmResult.End_Point,
//                     End_Longitude: tsmResult.End_Longitude,
//                     Road_Type: tsmResult.Road_Type
//                 }
//             })
//         }))
//     });
// }

// function getTotalinfo(resulIDs) {
//     var arr = resulIDs.Link_IDs;
//     var temp = []
//     return new Promise((resolve, reject) => {
//         arr.forEach((e, i, a) => {
//             temp.push(getTsmInfo(e))
//             temp.push(getGeoByID(e))
//         });
//         Promise.all(temp).then(success => {

//             resolve(success)
//         });
//     });

//     // var arr = resulIDs.Link_IDs;
//     // return new Promise((resolve, reject) => {
//     //     var arrlist = new Array();
//     //     for (var i = 0; i < arr.length; i++) {
//     //         Promise.all([getTsmInfo(arr[i]), getGeoByID(arr[i])]).then(data => {
//     //             var tsmResult = data[0];
//     //             var geoResult = data[1];
//     //             var result = {
//     //                 Link_ID: tsmResult.Link_ID,
//     //                 Street_Number: geoResult.Street_Number,
//     //                 Street_Name: geoResult.Street_Name,
//     //                 District_detial: geoResult.District,
//     //                 Region_eng: tsmResult.District,
//     //                 Region_chi: geoResult.Region,
//     //                 Start_Point: tsmResult.Start_Point,
//     //                 Start_Longitude: tsmResult.Start_Longitude,
//     //                 Start_Latitude: tsmResult.Start_Latitude,
//     //                 End_Point: tsmResult.End_Point,
//     //                 End_Longitude: tsmResult.End_Longitude,
//     //                 Road_Type: tsmResult.Road_Type
//     //             }
//     //             arrlist.push(result);
//     //             console.log(arrlist);
//     //         });
//     //     }
//     //     resolve(arrlist);
//     // });

// }


function getTsmInfo(lID) {
    var jsonResult;
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            var query = { Link_ID: lID };
            dbo.collection("tsm_link_info").find(query).toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    jsonResult = { message: "no record found", result: "" };
                    resolve(jsonResult);
                } else {
                    jsonResult = result[0];
                    resolve(jsonResult);
                }
                db.close();
            });
        });
    })
}

function getGeoByID(Lid) {
    var jsonResult;
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            var query = { Link_ID: "" + Lid };

            dbo.collection("tsm_geo").find(query).toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    jsonResult = { message: "no record found", result: "" };
                    resolve(jsonResult);
                } else {
                    jsonResult = result[0];
                    resolve(jsonResult);
                }
                db.close();
            });
        });
    })
}

// async function getLIDByRegion(region,res){
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("fyp_test");
//         dbo.collection("tsm_geo").find({Region:""+region}).toArray(function (err, result) {
//             var resulID;
//             if (err) {
//                 throw err;
//             }
//             if (result.length == 0) {
//                 resulID = {
//                     message : "no such record",
//                     result : ""
//                 };
//                 res.json(resulID);
//             }
//             else {
//                 var Link_IDs = new Array();
//                 for(var i = 0 ; i < result.length ; i++){
//                     Link_IDs.push(result[i].Link_ID);
//                 }
//                 resulID = {Link_IDs};
//                 getDataByLID(resulID);
//                 res.json(final);
//             }
//         });
//         db.close();
//     });
// }

// function getDataByLID(resulID){
//     return new Promise((resolve, reject) => {
//         var final = new Array();
//         for(var i = 0 ; i < resulID.Link_IDs.length ; i++){
//             final.push(getTotalinfo(resulID.Link_IDs[i]));
//         }
//     })
// }

// function getTotalinfo(lID){
//         var tsmResult = getTsmInfo(lID);
//         var geoResult = getGeoByID(lID);
//         console.log(tsmResult);
//         var result = {
//             Link_ID : tsmResult.Link_ID,
//             Street_Number : geoResult.Street_Number,
//             Street_Name : geoResult.Street_Name,
//             District_detial : geoResult.District,
//             Region_eng : tsmResult.District,
//             Region_chi : geoResult.Region,
//             Start_Point : tsmResult.Start_Point,
//             Start_Longitude : tsmResult.Start_Longitude,
//             Start_Latitude : tsmResult.Start_Latitude,
//             End_Point : tsmResult.End_Point,
//             End_Longitude : tsmResult.End_Longitude,
//             Road_Type : tsmResult.Road_Type
//         }
//        return result;
// }

// function getTsmInfo(lID){
//     var jsonResult;
//         MongoClient.connect(url, function (err, db) {
//             if (err) throw err;
//             var dbo = db.db("fyp_test");
//             var query = {Link_ID: lID};
//             dbo.collection("tsm_link_info").find(query).toArray(function (err, result) {
//                 if (err) {
//                     throw err;
//                 }
//                 if (result.length == 0) {
//                     jsonResult = {message:"no record found",result:""};
//                     return jsonResult;
//                 } else {
//                     jsonResult = result[0];
//                     return jsonResult;
//                 }
//                 db.close();
//             });
//         });
// }

// function getGeoByID(Lid){
//     var jsonResult;
//         MongoClient.connect(url, function (err, db) {
//             if (err) throw err;
//             var dbo = db.db("fyp_test");
//             var query = {Link_ID: ""+Lid};

//             dbo.collection("tsm_geo").find(query).toArray(function (err, result) {
//                 if (err) {
//                     throw err;
//                 }
//                 if (result.length == 0) {
//                     jsonResult = {message:"no record found",result:""};
//                     return jsonResult;
//                 } else {
//                     jsonResult = result[0];
//                     return jsonResult;
//                 }
//                 db.close();
//             });
//         });
// }






module.exports = router;
