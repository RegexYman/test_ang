var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fyp_test');
var modle = mongoose.model;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



/* GET home page. */
router.get('/', function (req, res, next) {
  // speedMapGetAndSave();
  // journyTimeGetAndSave();
  setInterval(function () {
    run();
    global.gc();
  }, 120000);
  // setInterval(run,20000);
  // res.send("Success!");
});

function run(){
  speedMapGetAndSave();
  journyTimeGetAndSave();
}

function addRawJsonToDB(json) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("fyp_test");
    var query = {"Capture_Date" : json.jtis_speedlist.jtis_speedmap[0].CAPTURE_DATE._text};
    dbo.collection("Raw_SpeedMap").find(query).toArray(function (err, result){
      if(err){
        throw err;
      }
      if(result.length == 0 ){
        dbo.collection("Raw_SpeedMap").insert(json, function (err, result) {
          if (err) throw err;
          console.log("RawSpeedMap was inserted");
        });
      }else{
        console.log("RawSpeedMap exist");
      }
    });
    
  });
}

function speedMapGetAndSave() {
  var datas = "";
  var httpUrls = {
    host: 'resource.data.one.gov.hk',
    path: '/td/speedmap.xml'
  };
  http.get(httpUrls, function (resxml) {
    resxml.on('data', function (chunk) {
      datas += chunk;
    });
    resxml.on('end', function () {
      var options = { compact: true, ignoreAttributes: true, ignoreComment: true, ignoreDeclaration: true };
      var result = convert.xml2js(datas, options);
      addRawJsonToDB(result);
      var captureD = result.jtis_speedlist.jtis_speedmap[0].CAPTURE_DATE._text;
      var speedMapSchema = new mongoose.Schema({
        "Capture_Date": String,
        "Speed_List": {
          "HK_Region": {
            "Poor_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            },
            "Average_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            },
            "Good_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            }
          },
          "KL_Region": {
            "Poor_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            },
            "Average_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            },
            "Good_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            }
          },
          "TM_Region": {
            "Poor_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            },
            "Average_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            },
            "Good_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            }
          },
          "ST_Region": {
            "Poor_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            },
            "Average_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            },
            "Good_Speed": {
              "Major_Route": [],
              "Urban_Route": []
            }
          }
        }
      });
      var speedMapModle;
      if (mongoose.models.speed_map) {
        speedMapModle = mongoose.model("speed_map");
      } else {
        speedMapModle = mongoose.model("speed_map", speedMapSchema);
      }
      module.exports = speedMapModle;
      var speedMap = new speedMapModle;
      module.exports = speedMapModle;
      speedMapModle.find({ "Capture_Date": captureD }, function (err, record) {
        if (err) {
          console.log("error");
        } else {
          if (record.length > 0) {
            console.log("Speed map record already exist!");
          } else {
            function addToHKPoorMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.HK_Region.Poor_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToHKPoorUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.HK_Region.Poor_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToHKAverageMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.HK_Region.Average_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToHKAverageUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.HK_Region.Average_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToHKGoodMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.HK_Region.Good_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToHKGoodUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.HK_Region.Good_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            //

            function addToKLPoorMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.KL_Region.Poor_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToKLPoorUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.KL_Region.Poor_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToKLAverageMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.KL_Region.Average_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToKLAverageUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.KL_Region.Average_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToKLGoodMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.KL_Region.Good_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToKLGoodUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.KL_Region.Good_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            //

            function addToTMPoorMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.TM_Region.Poor_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToTMPoorUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.TM_Region.Poor_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToTMAverageMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.TM_Region.Average_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToTMAverageUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.TM_Region.Average_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToTMGoodMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.TM_Region.Good_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToTMGoodUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.TM_Region.Good_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            //

            function addToSTPoorMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.ST_Region.Poor_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToSTPoorUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.ST_Region.Poor_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToSTAverageMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.ST_Region.Average_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToSTAverageUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.ST_Region.Average_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToSTGoodMajor(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.ST_Region.Good_Speed.Major_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }

            function addToSTGoodUrban(Link_ID, Traffic_Speed) {
              speedMap.Speed_List.ST_Region.Good_Speed.Urban_Route.push({
                "Link_ID": Link_ID,
                "Traffic_Speed": Traffic_Speed
              });
            }



            speedMap.Capture_Date = captureD;

            for (var i = 0; i < result.jtis_speedlist.jtis_speedmap.length; i++) {
              if (result.jtis_speedlist.jtis_speedmap[i].REGION._text == "HK") {
                if (result.jtis_speedlist.jtis_speedmap[i].ROAD_SATURATION_LEVEL._text == "TRAFFIC BAD") {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToHKPoorMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToHKPoorUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                } else if (result.jtis_speedlist.jtis_speedmap[i].ROAD_SATURATION_LEVEL._text == "TRAFFIC AVERAGE") {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToHKAverageMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToHKAverageUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                } else {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToHKGoodMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToHKGoodUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                }
              } else if (result.jtis_speedlist.jtis_speedmap[i].REGION._text == "K") {
                if (result.jtis_speedlist.jtis_speedmap[i].ROAD_SATURATION_LEVEL._text == "TRAFFIC BAD") {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToKLPoorMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToKLPoorUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                } else if (result.jtis_speedlist.jtis_speedmap[i].ROAD_SATURATION_LEVEL._text == "TRAFFIC AVERAGE") {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToKLAverageMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToKLAverageUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                } else {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToKLGoodMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToKLGoodUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                }
              } else if (result.jtis_speedlist.jtis_speedmap[i].REGION._text == "TM") {
                if (result.jtis_speedlist.jtis_speedmap[i].ROAD_SATURATION_LEVEL._text == "TRAFFIC BAD") {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToTMPoorMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToTMPoorUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                } else if (result.jtis_speedlist.jtis_speedmap[i].ROAD_SATURATION_LEVEL._text == "TRAFFIC AVERAGE") {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToTMAverageMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToTMAverageUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                } else {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToTMGoodMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToTMGoodUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                }
              } else {
                if (result.jtis_speedlist.jtis_speedmap[i].ROAD_SATURATION_LEVEL._text == "TRAFFIC BAD") {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToSTPoorMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToSTPoorUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                } else if (result.jtis_speedlist.jtis_speedmap[i].ROAD_SATURATION_LEVEL._text == "TRAFFIC AVERAGE") {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToSTAverageMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToSTAverageUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                } else {
                  if (result.jtis_speedlist.jtis_speedmap[i].ROAD_TYPE._text == "MAJOR ROUTE") {
                    addToSTGoodMajor(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  } else {
                    addToSTGoodUrban(result.jtis_speedlist.jtis_speedmap[i].LINK_ID._text, result.jtis_speedlist.jtis_speedmap[i].TRAFFIC_SPEED._text);
                  }
                }
              }
            }
            speedMap.save(function (err) {
              if (err) {
                console.log("save speed map error");
              } else {
                console.log("save speed map success!")
              }
            });
          }
        }
      });
      //console.log("Length:"+ result.jtis_speedlist.jtis_speedmap.length +"\n"+JSON.stringify(speedMap,null,4)+"\n");
    })
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });
}


function journyTimeGetAndSave() {
  var datas = "";
  var httpUrls = {
    host: 'resource.data.one.gov.hk',
    path: '/td/journeytime.xml'
  };
  http.get(httpUrls, function (resxml) {
    resxml.on('data', function (chunk) {
      datas += chunk;
    });
    resxml.on('end', function () {
      var options = { compact: true, ignoreAttributes: true, ignoreComment: true, ignoreDeclaration: true };
      var result = convert.xml2js(datas, options);
      var captureD = result.jtis_journey_list.jtis_journey_time[0].CAPTURE_DATE._text;
      var jtObjSchema = new mongoose.Schema({
        "CAPTURE_DATE": String,
        "Journey_List": []
      });
      var jtimeModle;
      if (mongoose.models.journey_time) {
        jtimeModle = mongoose.model("journey_time");
      } else {
        jtimeModle = mongoose.model("journey_time", jtObjSchema);
      }
      module.exports = jtimeModle;
      var jtObj = new jtimeModle;
      module.exports = jtimeModle;
      jtimeModle.find({ "CAPTURE_DATE": captureD }, function (err, record) {
        if (err) {
          console.log("error");
        } else {
          if (record.length > 0) {
            console.log("j time record already exist!");
          } else {
            jtObj.CAPTURE_DATE = captureD;
            for (var i = 0; i < result.jtis_journey_list.jtis_journey_time.length; i++) {
              jtObj.Journey_List.push({
                "LOCATION_ID": result.jtis_journey_list.jtis_journey_time[i].LOCATION_ID._text,
                "DESTINATION_ID": result.jtis_journey_list.jtis_journey_time[i].DESTINATION_ID._text,
                "JOURNEY_TYPE": result.jtis_journey_list.jtis_journey_time[i].JOURNEY_TYPE._text,
                "JOURNEY_DATA": result.jtis_journey_list.jtis_journey_time[i].JOURNEY_DATA._text,
                "COLOUR_ID": result.jtis_journey_list.jtis_journey_time[i].COLOUR_ID._text,
                "JOURNEY_DESC": result.jtis_journey_list.jtis_journey_time[i].JOURNEY_DESC._text
              });
            }
            jtObj.save(function (err) {
              if (err) {
                console.log("save j time error");
              } else {
                console.log("save j time success!")
              }
            });
          }
        }
      });
      //console.log("Length: " + result.jtis_journey_list.jtis_journey_time.length + "\n"+JSON.stringify(jtObj,null,4)+"\n");
    });
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });
}


module.exports = router;



