var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



router.post('/', function (req, res, next) {
    let { street_name, district, region} = req.body;
    if (street_name != null && street_name != "") {
        var query = {
            Street_Name: street_name
        };
        var match = {
            $match: {
                Street_Name: street_name
            }
        };
        getIdsByDistrict(query,match,res);
    } else if (district != null && district != "") {
        var query = {
            District : district
        };
        var match = {
            $match: {
                District: district
            }
        };
        getIdsByDistrict(query,match,res);
    } else if (region != null && region != "") {
        var query = {
            Region : region
        };
        var match = {
            $match: {
                Region: region
            }
        };
        getIdsByDistrict(query,match,res);
    } else{
        res.json({success:false,message:"parameter error"});
    }
});

function getIdsByDistrict(query, match, res) {
    // console.log(query);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        // var query = { District: district };
        dbo.collection("tsm_geo").find(query).toArray()
            .then(result => {
                if (result.length == 0) {
                    res.json({success:false,message:"no geo record"});
                } else {
                    getDataByID(match).then(datas => {
                        res.json(datas);
                        // console.log(datas);
                    })
                    dbo.close();
                }
            });
    });
}

function getDataByID(match) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fyp_test");
            var aggr = {
                $lookup:
                    {
                        from: 'tsm_link_info',
                        localField: "Link_ID",
                        foreignField: "Link_ID",
                        as: "informations"
                    }
            };
            var proj = {
                $project:
                    {
                        Link_ID: 1,
                        Street_Number: 1,
                        Street_Name: 1,
                        informations: 1
                    }
            };
            dbo.collection("tsm_geo").aggregate([aggr, match]).toArray()
                .then((result) => {
                    if (result.length == 0) {
                        resolve({ success: false, message: "No geo record" });
                    } else {
                        var a = [];
                        for (var i = 0; i < result.length; i++) {
                            var tsmResult = result[i].informations[0];
                            var geoResult = result[i];
                            var resultJSON = {
                                Link_ID: tsmResult.Link_ID,
                                Street_Number: geoResult.Street_Number,
                                Street_Name: geoResult.Street_Name,
                                District_detial: geoResult.District,
                                Region_eng: tsmResult.District,
                                Region_chi: geoResult.Region,
                                Start_Point: tsmResult.Start_Point,
                                Start_Longitude: tsmResult.Start_Longitude,
                                Start_Latitude: tsmResult.Start_Latitude,
                                End_Point: tsmResult.End_Point,
                                End_Longitude: tsmResult.End_Longitude,
                                Road_Type: tsmResult.Road_Type
                            }
                            a.push(resultJSON);
                        }
                        resolve(a);
                    }
                    dbo.close();
                });
        });
    });
}

module.exports = router;