var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

getIdsByDistrict("東區");

function getIdsByDistrict(district) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fyp_test");
        var query = { District: district };
        dbo.collection("tsm_geo").find(query).toArray()
            .then(result => {
                if (result.length == 0) {
                    
                } else {
                    getDataByID(district).then(datas=>{
                        console.log(datas);
                    })
                    dbo.close();
                }
            });
    });
}

function getDataByID(lID) {
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
            var match = {
                $match: {
                    District: lID
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
                    if(result.length == 0){
                        resolve({success:false,message:"No geo record"});
                    }else{
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